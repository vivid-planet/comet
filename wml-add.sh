#!/bin/bash

if [ -z "$1" ]; then
    echo "required argument: target";
    exit 1
fi
if [ ! -d "$1" ]; then
    echo "error: $1 is not a directory";
    exit 1
fi

custom_realpath() {
    if ! [ -x "$(command -v realpath)" ]; then
        grealpath "$@"
    else
        realpath "$@"
    fi
}

target=$(custom_realpath $1);
source=$(custom_realpath "$(dirname "$0")")

eval ./packages/admin/wml-add.sh $target/admin
eval ./packages/api/wml-add.sh $target/api
eval ./packages/site/wml-add.sh $target/site
