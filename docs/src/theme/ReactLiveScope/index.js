import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
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
    const cometAdminImports = require("@comet/admin");
    const { Visible: VisibleIcon, Grid: GridIcon, ...cometAdminIconsImports } = require("@comet/admin-icons");
    const cometAdminDateTimeImports = require("@comet/admin-date-time");
    const { Toolbar, ...cometAdminRteImports } = require("@comet/admin-rte");
    const cometAdminColorPickerImports = require("@comet/admin-color-picker");
    const cometAdminReactSelectImports = require("@comet/admin-react-select");
    const cometAdminThemeImports = require("@comet/admin-theme");
    const { Card, CardContent, FormControlLabel, Grid } = require("@mui/material");
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
            name: "@comet/admin-react-select",
            imports: cometAdminReactSelectImports,
        },
        {
            name: "@comet/admin-theme",
            imports: cometAdminThemeImports,
        },
        {
            name: "@mui/material",
            imports: { Card, CardContent, FormControlLabel, Grid },
        },
        {
            name: "react-final-form",
            imports: { Form },
        },
    ]);
}

export default ReactLiveScope;
