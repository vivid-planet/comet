import React from "react";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

// Add react-live imports you need here
let ReactLiveScope = {
    React,
    ...React,
};

if (ExecutionEnvironment.canUseDOM) {
    const { Field, FieldContainer, FinalFormCheckbox, MuiThemeProvider } = require("@comet/admin");
    const { createCometTheme } = require("@comet/admin-theme");
    const { Card, CardContent, FormControlLabel, Grid } = require("@mui/material");
    const { Form } = require("react-final-form");

    ReactLiveScope = {
        ...ReactLiveScope,
        Field,
        FieldContainer,
        FinalFormCheckbox,
        Card,
        CardContent,
        FormControlLabel,
        Grid,
        Form,
        createCometTheme,
        MuiThemeProvider,
    };
}

export default ReactLiveScope;
