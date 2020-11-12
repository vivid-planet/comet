import { addDecorator, configure } from "@storybook/react";
// tslint:disable-next-line: no-submodule-imports
import "@vivid-planet/react-admin-color-picker/src/themeAugmentation";
import { createMuiTheme, MuiThemeProvider as ThemeProvider } from "@vivid-planet/react-admin-mui";
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
