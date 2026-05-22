#!/bin/bash
set -e

echo "=== Deploying ChatVibe to Fly.io ==="

# Prerequisites check
command -v flyctl >/dev/null 2>&1 || { echo "Error: flyctl not installed. Install it first: curl -fsSL https://fly.io/install.sh | sh"; exit 1; }

# Login
flyctl auth whoami >/dev/null 2>&1 || flyctl auth login

# Create Postgres
echo "--- Creating Postgres database ---"
flyctl postgres create --name chatvibe-db --region bom --initial-cluster-size 1 --vm-size shared-cpu-1x --volume-size 10 || true

# Create Redis (Upstash)
echo "--- Creating Redis (Upstash) ---"
flyctl redis create --name chatvibe-redis --region bom || true

# Deploy API
echo "--- Deploying API ---"
cp infra/fly/api-fly.toml fly.toml
flyctl deploy --config fly.toml --dockerfile apps/api/Dockerfile
# Set secrets
flyctl secrets set \
  DATABASE_URL="$(flyctl postgres connect --app chatvibe-db -c 'postgres://postgres:password@chatvibe-db.fly.dev:5432/videochat')" \
  REDIS_URL="$(flyctl redis status --app chatvibe-redis --url)" \
  JWT_SECRET="$(openssl rand -hex 32)" \
  JWT_REFRESH_SECRET="$(openssl rand -hex 32)" \
  --app chatvibe-api

# Deploy Socket
echo "--- Deploying Socket Server ---"
cp infra/fly/socket-fly.toml fly.toml
flyctl deploy --config fly.toml --dockerfile apps/socket/Dockerfile

# Deploy Web
echo "--- Deploying Web App ---"
cp infra/fly/web-fly.toml fly.toml
flyctl deploy --config fly.toml --dockerfile apps/web/Dockerfile

# Cleanup
rm -f fly.toml

echo ""
echo "=== Deployment Complete ==="
echo "API:  https://chatvibe-api.fly.dev"
echo "Web:  https://chatvibe-web.fly.dev"
echo "Docs: https://chatvibe-api.fly.dev/api/docs"
echo "Socket: https://chatvibe-socket.fly.dev"
