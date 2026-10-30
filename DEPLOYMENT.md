# Deploying the Mineral Explorer to 10.100.14.6

This guide covers the production deployment on the shared server `10.100.14.6`. For local development, use `docker-compose.yml` as described in the [README](README.md).

## Ports

| Component | URL | Goes to |
|---|---|---|
| **Website (main URL)** | **http://10.100.14.6:3006** | `mom-expo-backend` port 4006, directly |
| Backend | http://10.100.14.6:4006 | `mom-expo-backend` port 4006 |
| Nginx | http://10.100.14.6:8086 | `mom-expo-nginx` port 80, which forwards to `mom-expo-backend:4006` |
| Socket.IO | port 5006 (reserved) | Not used: this app has no Socket.IO server |
| PostgreSQL | not published | Only reachable inside the `mom-expo-net` Docker network |

The website and the backend are the same Express app: it renders the pages itself, so ports 3006 and 4006 both reach it. Users should use **port 3006**. Nginx on 8086 is an alternative entry point (and the place to add a domain name later); the site does not depend on it.

## What gets created

Everything uses a `mom-expo` prefix so it does not collide with other applications on the server.

| Kind | Name | Purpose |
|---|---|---|
| Container | `mom-expo-db` | PostgreSQL 15 |
| Container | `mom-expo-backend` | Express app (image `mom-expo-backend:latest`) |
| Container | `mom-expo-nginx` | Nginx reverse proxy |
| Network | `mom-expo-net` | Private network shared by the three containers |
| Volume | `mom-expo-pgdata` | Database files |
| Volume | `mom-expo-uploads` | Images uploaded through the admin pages (`public/resource`) |

## Files

| File | Purpose |
|---|---|
| `docker-compose.prod.yml` | Production services, ports, volumes, health checks |
| `Dockerfile.prod` | Two-stage production image, runs as the non-root `node` user |
| `docker-entrypoint.sh` | Runs database migrations, then starts the app |
| `nginx.prod.conf` | Nginx config for port 8086 |
| `.env.production.example` | Template for the server's `.env.production` |
| `deploy.sh` | Checks, deploy, backup, restore, logs, stop |

## First deployment

### 1. Get the code onto the server

```bash
git clone https://github.com/Minster-of-Mining-and-Minerals/ministry-of-mines-Expo.git
cd ministry-of-mines-Expo
chmod +x deploy.sh
```

### 2. Create the production settings

```bash
cp .env.production.example .env.production
openssl rand -hex 32   # use the output for SESSION_SECRET
openssl rand -hex 24   # use the output for DB_PASSWORD
nano .env.production
chmod 600 .env.production
```

`deploy.sh` refuses to run if any value is empty or still starts with `change-me`. `.env.production` is gitignored; never commit it.

> `DB_USER`, `DB_PASSWORD` and `DB_NAME` are applied only when the database volume is first created. Changing them later in `.env.production` does not change the existing database.

### 3. Run the pre-flight checks

```bash
./deploy.sh check
```

This confirms that Docker and Docker Compose work, validates the compose file, and checks that ports 3006, 4006 and 8086 are free. If a port is taken by anything other than a `mom-expo-*` container, it stops and shows the process. It never stops or changes other applications. To check by hand:

```bash
ss -lntp | grep -E ':(3006|4006|5006|8086)\b'
docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

### 4. Deploy

```bash
./deploy.sh
```

This runs these steps and stops at the first failure:

1. Runs the same checks as `check`.
2. Backs up the database and uploads, if the database is already running.
3. Builds the backend image.
4. Starts the containers. The backend applies pending migrations before it starts listening; if a migration fails, the backend exits and the error is in its logs.
5. Waits until all three containers report healthy.
6. Seeds the database **only if it is empty** (see below).
7. Checks `/health` on ports 3006, 4006 and 8086, and that the home page loads on 3006 and 8086.

### 5. Change the default passwords

The initial seed creates **`admin` / `admin`** and **`staff` / `staff`**. Change both passwords immediately after the first deployment.

### 6. Open the firewall

`10.100.14.6` is a private address. Make sure the server firewall allows the clients that need access, for example with `ufw`:

```bash
sudo ufw allow 3006/tcp
sudo ufw allow 4006/tcp   # only if the backend should be reachable directly
sudo ufw allow 8086/tcp   # only if Nginx should be reachable
```

Docker-published ports can bypass `ufw` rules, so also check any network firewall between the clients and the server. Then open http://10.100.14.6:3006 from a client machine.

## Database migrations and seeding

- **Migrations** run automatically every time the backend container starts (`docker-entrypoint.sh`). Already-applied migrations are skipped.
- **Seeding is dangerous on a live database.** Every seed file deletes all rows from its table before inserting. `deploy.sh` therefore seeds only when both `zones` and `users` are empty, which is normally the first deployment only.
- Never run `npm run seed:run` or `npm run migrate:rollback` against production by hand. Both destroy data.

## Everyday commands

| Task | Command |
|---|---|
| Status and HTTP checks | `./deploy.sh status` |
| Follow all logs | `./deploy.sh logs` |
| Follow backend logs only | `./deploy.sh logs backend` |
| Update to new code | `git pull && ./deploy.sh` |
| Stop (data is kept) | `./deploy.sh stop` |
| Start again after stopping | `./deploy.sh` |
| Back up now | `./deploy.sh backup` |
| Restore a backup | `./deploy.sh restore backups/mom_expo_YYYYMMDD_HHMMSS.dump` |

The underlying Compose command, if you need it directly:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml <command>
```

Do **not** use `down -v`: it deletes the `mom-expo-pgdata` and `mom-expo-uploads` volumes.

## Backups

`./deploy.sh backup` writes two files to `backups/`:

- `mom_expo_<timestamp>.dump`: the database, in `pg_dump` custom format
- `mom_expo_<timestamp>.dump.uploads.tar.gz`: the uploaded images

`./deploy.sh` takes a backup automatically before each redeploy. Copy `backups/` off the server regularly.

`./deploy.sh restore <file>` asks for confirmation, backs up the current state first, stops the backend and Nginx, restores the database (and the uploads, if the matching archive exists), then starts everything again.

## Notes

- **Uploaded images** live in the `mom-expo-uploads` volume. On first deployment the volume is filled with the images committed in `public/resource`. Images added to the repository later are not copied into an existing volume.
- **Upload size:** Nginx accepts uploads up to 20 MB. Direct access on port 3006 has no Nginx limit.
- **Security headers** (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) are added by Nginx on port 8086 only.
- **CORS:** not needed. The browser only talks to the same server that renders the pages.

## Troubleshooting

| Symptom | Check |
|---|---|
| `deploy.sh` reports a port conflict | `ss -lntp \| grep :<port>` to see which process owns it. Get approval before using different ports. |
| Backend never becomes healthy | `./deploy.sh logs backend`: look for a migration error or "Missing required environment variables" |
| Works on the server but not from other PCs | Firewall rules (step 6) |
| Login works but you are logged out immediately | `SESSION_SECRET` changed between restarts |
