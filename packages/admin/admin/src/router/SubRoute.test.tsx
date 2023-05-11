/* eslint-disable @calm/react-intl/missing-formatted-message */
import { createTheme } from "@mui/material/styles";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import * as React from "react";
import { Route, Router, Switch, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";

import { MuiThemeProvider } from "../mui/ThemeProvider";
import { SubRoute, SubRouteIndexRoute, useSubRoutePrefix } from "../router/SubRoute";

test("Subrote other route hidden", async () => {
    function Cmp1() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <>
                <Switch>
                    <Route path={`${urlPrefix}/sub`}>
                        <div>Cmp1 Sub</div>
                    </Route>
                    <SubRouteIndexRoute>
                        <div>
                            <Link to={`${urlPrefix}/sub`}>Cmp1 SubLink</Link>
                        </div>
                    </SubRouteIndexRoute>
                </Switch>
            </>
        );
    }

    function Cmp2() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <>
                <Switch>
                    <Route path={`${urlPrefix}/sub`}>
                        <div>
                            <Link to={`${urlPrefix}/sub`}>Sub</Link>
                            <br />
                            <Link to={`${urlPrefix}/sub/sub2`}>Sub2</Link>
                        </div>
                        <Switch>
                            <Route path={`${urlPrefix}/sub/sub2`}>
                                <div>Cmp2 Sub2</div>
                            </Route>
                            <Route>
                                <div>Cmp2 Sub</div>
                            </Route>
                        </Switch>
                    </Route>
                    <SubRouteIndexRoute>
                        <div>
                            <Link to={`${urlPrefix}/sub`}>Cmp2 SubLink</Link>
                        </div>
                    </SubRouteIndexRoute>
                </Switch>
            </>
        );
    }

    function Story() {
        const match = useRouteMatch();
        return (
            <div>
                <SubRoute path={`${match.url}/cmp1`}>
                    <div>
                        <Cmp1 />
                    </div>
                </SubRoute>
                <SubRoute path={`${match.url}/cmp2`}>
                    <div>
                        <Cmp2 />
                    </div>
                </SubRoute>
            </div>
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

    fireEvent.click(rendered.getByText("Cmp1 SubLink"));

    await waitFor(() => {
        expect(rendered.getByText("Cmp1 Sub")).toBeInTheDocument();
    });
    expect(rendered.queryByText("Cmp2 SubLink")).not.toBeInTheDocument();
});

test("Subrote other route hidden", async () => {
    function Cmp1() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <>
                <Switch>
                    <Route path={`${urlPrefix}/sub`}>
                        <div>Cmp1 Sub</div>
                    </Route>
                    <SubRouteIndexRoute>
                        <div>
                            <Link to={`${urlPrefix}/sub`}>Cmp1 SubLink</Link>
                        </div>
                    </SubRouteIndexRoute>
                </Switch>
            </>
        );
    }

    function Cmp2() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <>
                <Switch>
                    <Route path={`${urlPrefix}/sub`}>
                        <div>
                            <Link to={`${urlPrefix}/sub`}>Sub</Link>
                            <br />
                            <Link to={`${urlPrefix}/sub/sub2`}>Sub2</Link>
                        </div>
                        <Switch>
                            <Route path={`${urlPrefix}/sub/sub2`}>
                                <div>Cmp2 Sub2</div>
                            </Route>
                            <Route>
                                <div>Cmp2 Sub</div>
                            </Route>
                        </Switch>
                    </Route>
                    <SubRouteIndexRoute>
                        <div>
                            <Link to={`${urlPrefix}/sub`}>Cmp2 SubLink</Link>
                        </div>
                    </SubRouteIndexRoute>
                </Switch>
            </>
        );
    }

    function Story() {
        const match = useRouteMatch();
        return (
            <div>
                <SubRoute path={`${match.url}/cmp1`}>
                    <div>
                        <Cmp1 />
                    </div>
                </SubRoute>
                <SubRoute path={`${match.url}/cmp2`}>
                    <div>
                        <Cmp2 />
                    </div>
                </SubRoute>
            </div>
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

    fireEvent.click(rendered.getByText("Cmp2 SubLink"));

    await waitFor(() => {
        expect(rendered.getByText("Cmp2 Sub")).toBeInTheDocument();
    });
    expect(rendered.queryByText("Cmp1 SubLink")).not.toBeInTheDocument();
    fireEvent.click(rendered.getByText("Sub2"));

    await waitFor(() => {
        expect(rendered.getByText("Cmp2 Sub2")).toBeInTheDocument();
    });
    expect(rendered.queryByText("Cmp2 Sub")).not.toBeInTheDocument();
});
