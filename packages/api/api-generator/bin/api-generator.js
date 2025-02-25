#!/usr/bin/env node
require("ts-node").register({
    require: ["tsconfig-paths/register"],
});
require("../lib/apiGenerator");
