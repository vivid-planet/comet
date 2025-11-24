#!/usr/bin/env sh

cd "$(dirname "$0")" || exit

rm -rf ./lang/
mkdir -p ./lang

git clone https://github.com/vivid-planet/comet-demo-saas-lang lang/comet-demo-saas-lang
git clone https://github.com/vivid-planet/comet-lang.git lang/comet-lang
