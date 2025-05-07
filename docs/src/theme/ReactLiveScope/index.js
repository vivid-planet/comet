import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
// eslint-disable-next-line no-restricted-imports
import React from "react";

// Add react-live imports you need here
let ReactLiveScope = {
    React,
    ...React,
};

const generateScope = (imports) => {
    findDuplicateImports(imports);

    let scope = {};
    for (const imp of imports) {
        scope = { ...scope, ...imp.imports };
    }
    return scope;
};

const findDuplicateImports = (imports) => {
    const map = new Map();

    for (const imp of imports) {
        const name = imp.name;
        const imps = imp.imports;

        for (const key of Object.keys(imps)) {
            if (map.has(key)) {
                map.set(key, [...map.get(key), name]);
            } else {
                map.set(key, [name]);
            }
        }
    }

    for (let [key, value] of map) {
        if (value.length > 1) {
            console.warn(`Found duplicate: ${key} \n in following packages: ${value.join(", ")}`);
        }
    }
};

if (ExecutionEnvironment.canUseDOM) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cometAdminImports = require("@comet/admin");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Visible: VisibleIcon, Grid: GridIcon, ...cometAdminIconsImports } = require("@comet/admin-icons");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cometAdminDateTimeImports = require("@comet/admin-date-time");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Toolbar, ...cometAdminRteImports } = require("@comet/admin-rte");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cometAdminColorPickerImports = require("@comet/admin-color-picker");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Card, CardContent, FormControlLabel, Grid, Chip, IconButton, Typography, Box } = require("@mui/material");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Form } = require("react-final-form");

    ReactLiveScope = generateScope([
        {
            name: "ReactLiveScope",
            imports: ReactLiveScope,
        },
        {
            name: "@comet/admin",
            imports: cometAdminImports,
        },
        {
            name: "@comet/admin-icons",
            imports: { VisibleIcon, GridIcon, ...cometAdminIconsImports },
        },
        {
            name: "@comet/admin-date-time",
            imports: cometAdminDateTimeImports,
        },
        {
            name: "@comet/admin-rte",
            imports: cometAdminRteImports,
        },
        {
            name: "@comet/admin-color-picker",
            imports: cometAdminColorPickerImports,
        },
        {
            name: "@mui/material",
            imports: { Card, CardContent, FormControlLabel, Grid, Chip, IconButton, Typography, Box },
        },
        {
            name: "react-final-form",
            imports: { Form },
        },
    ]);
}

export default ReactLiveScope;
