#!/usr/bin/env bash
# Deployment helper for the Mineral Explorer on server 10.100.14.6.
# Usage: ./deploy.sh [check|deploy|status|logs|stop|backup|restore <file>]
# See DEPLOYMENT.md for details.
set -euo pipefail

cd "$(dirname "$0")"

ENV_FILE=".env.production"
COMPOSE_FILE="docker-compose.prod.yml"
PORTS=(3006 4006 8086)
SERVER_IP="${SERVER_IP:-10.100.14.6}"
BACKUP_DIR="backups"

die() { echo "ERROR: $*" >&2; exit 1; }
info() { echo "==> $*"; }

compose() { docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"; }

load_env() {
    [ -f "$ENV_FILE" ] || die "$ENV_FILE not found. Copy .env.production.example to $ENV_FILE and fill in real values."
    set -a; . "./$ENV_FILE"; set +a
    for var in DB_USER DB_PASSWORD DB_NAME SESSION_SECRET; do
        [ -n "${!var:-}" ] || die "$var is empty in $ENV_FILE"
        case "${!var}" in change-me*) die "$var in $ENV_FILE still has the example value";; esac
    done
}

check_tools() {
    command -v docker >/dev/null || die "docker is not installed"
    docker compose version >/dev/null 2>&1 || die "docker compose plugin is not available"
    docker info >/dev/null 2>&1 || die "cannot talk to the Docker daemon (is it running? are you in the docker group?)"
    command -v ss >/dev/null || die "ss is not installed (needed for the port check)"
    command -v curl >/dev/null || die "curl is not installed (needed for the HTTP checks)"
    info "Docker $(docker version --format '{{.Server.Version}}'), $(docker compose version --short)"
}

# A port is fine if it is free or already published by one of our own containers
check_ports() {
    local conflict=0 port owner
    for port in "${PORTS[@]}"; do
        if ss -lntH "sport = :$port" | grep -q .; then
            owner=$(docker ps --filter "publish=$port" --format '{{.Names}}' | head -n1)
            if [[ "$owner" == mom-expo-* ]]; then
                info "Port $port is used by our own container $owner (ok)"
            else
                echo "CONFLICT: port $port is already in use by ${owner:-a non-Docker process}:" >&2
                ss -lntpH "sport = :$port" >&2 || true
                conflict=1
            fi
        else
            info "Port $port is free"
        fi
    done
    [ "$conflict" -eq 0 ] || die "required ports are in use. Nothing was changed; resolve the conflict or get approval for different ports."
}

db_running() { [ "$(docker ps -q --filter name=^mom-expo-db$)" != "" ]; }

backup() {
    load_env
    db_running || die "mom-expo-db is not running; nothing to back up"
    mkdir -p "$BACKUP_DIR"
    local file="$BACKUP_DIR/mom_expo_$(date +%Y%m%d_%H%M%S).dump"
    info "Backing up database to $file"
    compose exec -T db pg_dump -U "$DB_USER" -d "$DB_NAME" -Fc > "$file" || { rm -f "$file"; die "pg_dump failed"; }
    [ -s "$file" ] || { rm -f "$file"; die "backup file is empty"; }
    info "Backing up uploaded images to $file.uploads.tar.gz"
    docker run --rm -v mom-expo-uploads:/data:ro -v "$PWD/$BACKUP_DIR":/backup alpine \
        tar czf "/backup/$(basename "$file").uploads.tar.gz" -C /data . || die "uploads backup failed"
    info "Backup complete"
}

restore() {
    local file="${1:-}"
    [ -f "$file" ] || die "usage: ./deploy.sh restore backups/<file>.dump"
    load_env
    db_running || die "mom-expo-db is not running"
    read -r -p "This replaces the current database with $file. Type 'restore' to continue: " answer
    [ "$answer" = "restore" ] || die "aborted"
    backup
    info "Stopping backend during restore"
    compose stop backend nginx
    compose exec -T db pg_restore -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --no-owner < "$file" || die "pg_restore failed; the pre-restore backup is in $BACKUP_DIR"
    if [ -f "$file.uploads.tar.gz" ]; then
        info "Restoring uploaded images"
        docker run --rm -v mom-expo-uploads:/data -v "$PWD/$(dirname "$file")":/backup:ro alpine \
            tar xzf "/backup/$(basename "$file").uploads.tar.gz" -C /data || die "uploads restore failed"
    fi
    compose up -d
    wait_healthy
    info "Restore complete"
}

wait_healthy() {
    local name status i
    for name in mom-expo-db mom-expo-backend mom-expo-nginx; do
        for i in $(seq 1 40); do
            status=$(docker inspect -f '{{.State.Health.Status}}' "$name" 2>/dev/null || echo missing)
            [ "$status" = "healthy" ] && break
            sleep 3
        done
        if [ "$status" != "healthy" ]; then
            docker logs --tail 50 "$name" >&2 || true
            die "$name did not become healthy (status: $status). Logs above."
        fi
        info "$name is healthy"
    done
}

# The seed files delete every row before inserting, so only seed an empty database
seed_if_empty() {
    local count
    count=$(compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" -tAc \
        "select (select count(*) from zones) + (select count(*) from users)") || die "could not check whether the database is empty"
    if [ "$count" = "0" ]; then
        info "Database is empty - running initial seed"
        compose exec -T backend npx knex --knexfile=./db/knexfile.js seed:run || die "seeding failed"
        echo "IMPORTANT: the seed creates admin/admin and staff/staff. Change these passwords now." >&2
    else
        info "Database already has data - skipping seed"
    fi
}

http_check() {
    local url="$1" expect="$2" body
    body=$(curl -fsS --max-time 10 "$url") || die "$url is not responding"
    grep -q "$expect" <<<"$body" || die "$url responded but without the expected content"
    info "OK  $url"
}

verify() {
    http_check "http://127.0.0.1:3006/health" '"status":"ok"'
    http_check "http://127.0.0.1:4006/health" '"status":"ok"'
    http_check "http://127.0.0.1:8086/health" '"status":"ok"'
    http_check "http://127.0.0.1:3006/" '<html'
    http_check "http://127.0.0.1:8086/" '<html'
    echo
    info "Website: http://$SERVER_IP:3006"
    info "Backend: http://$SERVER_IP:4006"
    info "Nginx:   http://$SERVER_IP:8086"
}

deploy() {
    check_tools
    load_env
    compose config -q || die "$COMPOSE_FILE is invalid"
    check_ports
    if db_running; then backup; fi
    info "Building images"
    compose build
    info "Starting containers (migrations run when the backend starts)"
    compose up -d
    wait_healthy
    seed_if_empty
    verify
    info "Deployment complete"
}

case "${1:-deploy}" in
    check)   check_tools; load_env; compose config -q && info "Compose file is valid"; check_ports ;;
    deploy)  deploy ;;
    status)  load_env; compose ps; verify ;;
    logs)    load_env; compose logs -f --tail 100 "${@:2}" ;;
    stop)    load_env; compose stop; info "Stopped. Data volumes are kept." ;;
    backup)  backup ;;
    restore) restore "${2:-}" ;;
    *)       die "unknown command '$1'. Use: check|deploy|status|logs|stop|backup|restore <file>" ;;
esac
