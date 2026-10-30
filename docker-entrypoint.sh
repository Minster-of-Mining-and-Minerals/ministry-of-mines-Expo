#!/bin/sh
# Apply pending database migrations before the server accepts traffic.
# If a migration fails the container exits and the error shows in the logs.
set -e

echo "Running database migrations..."
npx knex --knexfile=./db/knexfile.js migrate:latest
echo "Migrations complete."

exec "$@"
