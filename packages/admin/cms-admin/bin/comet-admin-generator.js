#!/usr/bin/env node
require("ts-node").register({
    require: ["tsconfig-paths/register"],
});
require(`${__dirname}/../lib/generator/generate`);
