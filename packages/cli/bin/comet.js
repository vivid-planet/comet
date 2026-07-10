#!/usr/bin/env node
require("ts-node").register({ transpileOnly: true, skipProject: true, compilerOptions: { ignoreDeprecations: "6.0" } });
require("../lib/comet");
