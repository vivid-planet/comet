import { createMuiTheme } from "@material-ui/core";
import { RouterBrowserRouter } from "@vivid-planet/react-admin-core";
import { MuiThemeProvider as ThemeProvider } from "@vivid-planet/react-admin-mui";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

const theme = createMuiTheme({});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <RouterBrowserRouter>
            <App />
        </RouterBrowserRouter>
    </ThemeProvider>,
    document.getElementById("root"),
);
