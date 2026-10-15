#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Pulling latest changes from the repository..."
git pull

echo "Injecting site configs..."
npx -y @dextinity/cli inject-site-configs -f ../site-configs/site-configs.ts -i docker-compose.tpl.yml -o docker-compose.yml --base64

echo "Building and starting the Docker containers..."
# One after another, so the build fits into the Droplet's memory
for service in api admin site; do
    docker compose build "$service"
done
docker compose up --detach --remove-orphans
docker image prune --force

echo "Watch logs with: \"docker compose -f demo/.docker-compose/docker-compose.yml logs -f\""
