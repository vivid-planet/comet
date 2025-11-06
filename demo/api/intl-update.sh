#!/usr/bin/env sh

cd "$(dirname "$0")" || exit

rm -rf ./lang/
mkdir -p ./lang

git clone https://github.com/vivid-planet/comet-demo-lang lang/comet-demo-lang
