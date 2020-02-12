#!/bin/sh
set -e

if [ -n "$INSTALL_DEPS" ]; then 
    docker-compose run --rm react-admin bash -c "yarn install"
fi

docker-compose run --rm react-admin bash -c "yarn run lint"
