/* eslint-disable @calm/react-intl/missing-formatted-message */
import { createTheme } from "@mui/material/styles";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import * as React from "react";
import { Router } from "react-router";

import { MuiThemeProvider } from "../mui/ThemeProvider";
import { StackBreadcrumbs } from "./breadcrumbs/StackBreadcrumbs";
import { StackPage } from "./Page";
import { Stack } from "./Stack";
import { StackSwitch, StackSwitchApiContext } from "./Switch";

test("StackNested basic test", async () => {
    function Page1() {
        const switchApi = React.useContext(StackSwitchApiContext);
        return (
            <div>
                <button
                    onClick={(e) => {
                        switchApi.activatePage("page2", "test");
                    }}
                >
                    activate page2
                </button>
            </div>
        );
    }

    function Page2() {
        return (
            <Stack topLevelTitle="Stack Nested">
                <StackBreadcrumbs />
                <StackSwitch>
                    <StackPage name="page1">
                        <Page1 />
                    </StackPage>
                    <StackPage name="page2">page2-2</StackPage>
                </StackSwitch>
            </Stack>
        );
    }

    function Story() {
        return (
            <Stack topLevelTitle="Stack">
                <StackBreadcrumbs />
                <StackSwitch>
                    <StackPage name="page1">
                        <Page1 />
                    </StackPage>
                    <StackPage name="page2">
                        <Page2 />
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    }
    const history = createMemoryHistory();

    const rendered = render(
        <MuiThemeProvider theme={createTheme()}>
            <Router history={history}>
                <Story />
            </Router>
        </MuiThemeProvider>,
    );

    fireEvent.click(rendered.getByText("activate page2"));

    await rendered.findByText("page2");

    await waitFor(() => {
        expect(rendered.getByText("page2")).toBeInTheDocument();
    });

    fireEvent.click(rendered.getByText("activate page2"));

    // two page2 breadcrumb item, one for outer stack, one for inner stack
    await waitFor(() => {
        expect(rendered.getAllByText("page2").length).toBe(2);
    });
});
