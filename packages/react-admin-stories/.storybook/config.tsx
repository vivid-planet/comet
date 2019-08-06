import { createMuiTheme } from "@material-ui/core";
import { addDecorator, configure } from "@storybook/react";
import { MuiThemeProvider as ThemeProvider } from "@vivid-planet/react-admin-mui";
import * as React from "react";

const req = require.context("../src", true, /\.tsx$/);

function loadStories() {
    req.keys().forEach(req);
}

addDecorator(story => {
    const theme = createMuiTheme({});

    return <ThemeProvider theme={theme}>{story()}</ThemeProvider>;
});

configure(loadStories, module);
