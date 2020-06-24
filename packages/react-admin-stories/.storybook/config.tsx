import { createMuiTheme } from "@material-ui/core";
import { addDecorator, configure } from "@storybook/react";
import { MuiThemeProvider as ThemeProvider } from "@vivid-planet/react-admin-mui";
import * as React from "react";

const req = require.context("../src", true, /\.tsx$/);

function loadStories() {
    req.keys().forEach(req);
}

addDecorator(story => {
    const theme = createMuiTheme({
        spacing: 5,
        overrides: {
            MuiFormControl: {
                root: {
                    marginBottom: "20px",
                },
            },
            MuiInputBase: {
                input: {
                    border: "1px solid #d8dbdf",
                    borderRadius: "2px",
                    padding: "0 10px",
                    height: "32px",
                },
            },
        },
    });

    return <ThemeProvider theme={theme}>{story()}</ThemeProvider>;
});

configure(loadStories, module);
