#!/bin/bash

if [ -z "$1" ]; then
    echo "required argument: target";
    exit 1
fi
if [ ! -d "$1" ]; then
    echo "error: $1 is not a directory";
    exit 1
fi
if [ ! -d "$1/node_modules/@vivid-planet" ]; then
    echo "error: $1 must be a directory that contains node_modules/@vivid-planet";
    exit 1
fi

custom_realpath() {
    if ! [ -x "$(command -v realpath)" ]; then
        grealpath "$@"
    else
        realpath "$@"
    fi
}

target=$(custom_realpath "$1/node_modules/@vivid-planet");
source=$(custom_realpath "$(dirname "$0")")
echo $target
echo $source
packages=( file-icons material-ui-react-select react-admin-core react-admin-date-fns react-admin-final-form-material-ui react-admin-form react-admin-layout react-admin-mui react-admin-rte )
for package in "${packages[@]}"; do
    cmd="wml add $source/packages/$package $target/$package"
    echo $cmd
    $cmd
done

