import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import React from "react";

// Add react-live imports you need here
let ReactLiveScope = {
    React,
    ...React,
};

// const findDuplicateKeys = (objs, names) => {
//     const map = new Map();
//
//     for (let i = 0; i < objs.length; i++) {
//         const objName = names[i];
//         const obj = objs[i];
//
//         for (const key of Object.keys(obj)) {
//             if (map.has(key)) {
//                 map.set(key, [...map.get(key), objName]);
//             } else {
//                 map.set(key, [objName]);
//             }
//         }
//     }
//
//     for (let [key, value] of map) {
//         if (value.length > 1) {
//             console.log(key);
//             console.log(value);
//             console.log("---------------\n");
//         }
//     }
// };

if (ExecutionEnvironment.canUseDOM) {
    const cometAdminImports = require("@comet/admin");
    const cometAdminIconsImports = require("@comet/admin-icons");
    const cometAdminDateTimeImports = require("@comet/admin-date-time");
    const cometAdminRteImports = require("@comet/admin-rte");
    const cometAdminColorPickerImports = require("@comet/admin-color-picker");
    const cometAdminReactSelectImports = require("@comet/admin-react-select");
    const { createCometTheme } = require("@comet/admin-theme");
    const { Card, CardContent, FormControlLabel, Grid } = require("@mui/material");
    const { Form } = require("react-final-form");

    // const diverse = {
    //     Card,
    //     CardContent,
    //     FormControlLabel,
    //     Grid,
    //     Form,
    //     createCometTheme,
    // };
    //
    // findDuplicateKeys(
    //     [
    //         ReactLiveScope,
    //         cometAdminIconsImports,
    //         cometAdminImports,
    //         cometAdminDateTimeImports,
    //         cometAdminRteImports,
    //         cometAdminColorPickerImports,
    //         cometAdminReactSelectImports,
    //         diverse,
    //     ],
    //     [
    //         "ReactLiveScope",
    //         "cometAdminIconsImports",
    //         "cometAdminImports",
    //         "cometAdminDateTimeImports",
    //         "cometAdminRteImports",
    //         "cometAdminColorPickerImports",
    //         "cometAdminReactSelectImports",
    //         "mui",
    //     ],
    // );

    ReactLiveScope = {
        ...ReactLiveScope,
        Card,
        CardContent,
        FormControlLabel,
        Grid,
        Form,
        createCometTheme,
        ...cometAdminImports,
        ...cometAdminDateTimeImports,
        ...cometAdminColorPickerImports,
        ...cometAdminReactSelectImports,
    };
}

export default ReactLiveScope;
