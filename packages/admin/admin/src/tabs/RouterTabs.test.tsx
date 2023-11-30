/* eslint-disable @calm/react-intl/missing-formatted-message */
import { createTheme } from "@mui/material/styles";
import { fireEvent, render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import * as React from "react";
import { Router, useRouteMatch } from "react-router";

import { MuiThemeProvider } from "../mui/ThemeProvider";
import { SubRoute, useSubRoutePrefix } from "../router/SubRoute";
import { RouterTab, RouterTabs } from "./RouterTabs";

test("RouterTabs in SubRoute", async () => {
    function Cmp1() {
        const match = useRouteMatch();
        return <p>matchUrl={match?.url}</p>;
    }

    function Story() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <SubRoute path={`${urlPrefix}/sub`}>
                <RouterTabs>
                    <RouterTab label="Foo" path="">
                        <p>foo tab content</p>
                    </RouterTab>
                    <RouterTab label="Bar" path="/bar">
                        <p>bar tab content</p>
                        <Cmp1 />
                    </RouterTab>
                </RouterTabs>
            </SubRoute>
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
    expect(rendered.getByText("foo tab content")).toBeInTheDocument();

    fireEvent.click(rendered.getByText("Bar"));

    expect(rendered.getByText("bar tab content")).toBeInTheDocument();
    expect(rendered.getByText("matchUrl=/sub/bar")).toBeInTheDocument();
});
