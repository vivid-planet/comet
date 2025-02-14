#!/usr/bin/env node
require("ts-node").register({
    transpileOnly: true, // increases ramp up time of generator - see: https://github.com/TypeStrong/ts-node?tab=readme-ov-file#transpileonly
    require: ["tsconfig-paths/register"],
});
require("../lib/comet");
