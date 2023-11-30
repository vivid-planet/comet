/* eslint-disable @calm/react-intl/missing-formatted-message */
import { createTheme } from "@mui/material/styles";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";
import { Redirect, Route, Switch } from "react-router";
import { Link } from "react-router-dom";

import { MuiThemeProvider } from "../mui/ThemeProvider";
import { RouterMemoryRouter } from "./MemoryRouter";
import { RouterPrompt } from "./Prompt";

test("Nested route in Prompt", async () => {
    function Story() {
        return (
            <Switch>
                <Route path="/foo">
                    <RouterPrompt
                        message={() => {
                            return "sure?";
                        }}
                        subRoutePath="/foo/s"
                    >
                        <Link to="/foo/s/sub">subLink</Link>
                        <Route path="/foo/s/sub">
                            <div>sub</div>
                        </Route>
                    </RouterPrompt>
                </Route>
                <Redirect to="/foo" />
            </Switch>
        );
    }

    const rendered = render(
        <IntlProvider locale="en" messages={{}}>
            <MuiThemeProvider theme={createTheme()}>
                <RouterMemoryRouter>
                    <Story />
                </RouterMemoryRouter>
            </MuiThemeProvider>
        </IntlProvider>,
    );

    fireEvent.click(rendered.getByText("subLink"));

    // verify navigation to sub didn't get blocked
    await waitFor(() => {
        const sub = rendered.queryAllByText("sub");
        expect(sub.length).toBe(1);
    });
});

test("Nested route with non-sub-path route in Prompt", async () => {
    function Story() {
        return (
            <Switch>
                <Route path="/foo">
                    <RouterPrompt
                        message={() => {
                            return "sure?";
                        }}
                        subRoutePath="/foo/s"
                    >
                        <Link to="/foo/s/sub">subLink</Link>
                        <Link to="/foo">fooLink</Link>
                        <Route path="/foo">
                            <div>foo</div>
                        </Route>
                        <Route path="/foo/s/sub">
                            <div>sub</div>
                        </Route>
                    </RouterPrompt>
                </Route>
                <Redirect to="/foo" />
            </Switch>
        );
    }

    const rendered = render(
        <IntlProvider locale="en" messages={{}}>
            <MuiThemeProvider theme={createTheme()}>
                <RouterMemoryRouter>
                    <Story />
                </RouterMemoryRouter>
            </MuiThemeProvider>
        </IntlProvider>,
    );

    fireEvent.click(rendered.getByText("subLink"));

    // verify navigation to /foo/sub didn't get blocked
    await waitFor(() => {
        const sub = rendered.queryAllByText("sub");
        expect(sub.length).toBe(1);
    });

    fireEvent.click(rendered.getByText("fooLink"));

    // verify navigation back to /foo didn't get blocked
    await waitFor(() => {
        const sub = rendered.queryAllByText("sub");
        expect(sub.length).toBe(0);
    });
});

test("route outside Prompt", async () => {
    function Story() {
        return (
            <Switch>
                <Route path="/" exact={true}>
                    <RouterPrompt
                        message={() => {
                            return "sure?";
                        }}
                        subRoutePath="/s"
                    >
                        <Link to="/bar">barLink</Link>
                    </RouterPrompt>
                </Route>
                <Route path="/bar">bar</Route>
            </Switch>
        );
    }

    const rendered = render(
        <IntlProvider locale="en" messages={{}}>
            <MuiThemeProvider theme={createTheme()}>
                <RouterMemoryRouter>
                    <Story />
                </RouterMemoryRouter>
            </MuiThemeProvider>
        </IntlProvider>,
    );

    fireEvent.click(rendered.getByText("barLink"));

    // verify navigation to bar did get blocked
    await waitFor(() => {
        const sub = rendered.queryAllByText("bar");
        expect(sub.length).toBe(0);
    });

    // and dirty dialog is shown
    await waitFor(() => {
        const sub = rendered.queryAllByText("sure?");
        expect(sub.length).toBe(1);
    });
});
