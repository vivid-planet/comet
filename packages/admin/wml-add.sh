#!/bin/bash

if [ -z "$1" ]; then
    echo "required argument: target";
    exit 1
fi
if [ ! -d "$1" ]; then
    echo "error: $1 is not a directory";
    exit 1
fi
if [ ! -d "$1/node_modules/@comet" ]; then
    echo "error: $1 must be a directory that contains node_modules/@comet";
    exit 1
fi

custom_realpath() {
    if ! [ -x "$(command -v realpath)" ]; then
        grealpath "$@"
    else
        realpath "$@"
    fi
}

target=$(custom_realpath "$1/node_modules/@comet");
source=$(custom_realpath "$(dirname "$0")")
echo $target
echo $source
packages=( admin admin-blocks admin-cms admin-color-picker admin-icons admin-react-select admin-rte admin-theme )
for package in "${packages[@]}"; do
    cmd="wml add $source/$package $target/$package"
    echo $cmd
    $cmd
done

packages=( eslint-config )
for package in "${packages[@]}"; do
    cmd="wml add $source/../$package $target/$package"
    echo $cmd
    $cmd
done
