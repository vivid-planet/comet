#!/usr/bin/env node

require("ts-node").register({
    require: ["tsconfig-paths/register"],
    transpileOnly: true,
});

import "../lib/adminGenerator.js";
