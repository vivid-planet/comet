/* eslint-disable @calm/react-intl/missing-formatted-message */
import { createTheme } from "@mui/material/styles";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import * as React from "react";
import { Router } from "react-router";

import { MuiThemeProvider } from "../mui/ThemeProvider";
import { SubRoute, useSubRoutePrefix } from "../router/SubRoute";
import { StackBreadcrumbs } from "./breadcrumbs/StackBreadcrumbs";
import { StackPage } from "./Page";
import { Stack } from "./Stack";
import { StackLink } from "./StackLink";
import { StackSwitch } from "./Switch";

test("multiple stacks on same page", async () => {
    function Story() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <Stack topLevelTitle="Stack">
                <StackBreadcrumbs />
                <SubRoute path={`${urlPrefix}/first`}>
                    <StackSwitch>
                        <StackPage name="page1">
                            <p>First Page1</p>
                            <StackLink pageName="page2" payload="test">
                                activate First Page2
                            </StackLink>
                        </StackPage>
                        <StackPage name="page2">First Page2</StackPage>
                    </StackSwitch>
                </SubRoute>
                <SubRoute path={`${urlPrefix}/second`}>
                    <StackSwitch>
                        <StackPage name="page1">
                            <p>Second Page1</p>
                            <StackLink pageName="page2" payload="test">
                                activate Second Page2
                            </StackLink>
                        </StackPage>
                        <StackPage name="page2">Second Page2</StackPage>
                    </StackSwitch>
                </SubRoute>
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

    fireEvent.click(rendered.getByText("activate First Page2"));

    await waitFor(() => {
        expect(rendered.getByText("First Page2")).toBeInTheDocument();
    });
    expect(rendered.queryByText("Second Page1")).not.toBeInTheDocument();
    expect(rendered.queryByText("Second Page2")).not.toBeInTheDocument();
});
