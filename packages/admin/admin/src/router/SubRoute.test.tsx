import { type ReactNode } from "react";
import { Link, matchPath, useLocation } from "react-router";
import { cleanup, fireEvent, render, waitFor } from "test-utils";
import { afterEach, expect, test } from "vitest";

import { SubRoute, SubRouteIndexRoute, useSubRoutePrefix } from "../router/SubRoute";

afterEach(cleanup);

/**
 * Helper component that mimics Switch+Route from v5.
 * Shows only the first matching Route child, or the fallback.
 */
function SwitchRoutes({ children, routes }: { children?: ReactNode; routes: Array<{ path: string; element: ReactNode }> }) {
    const location = useLocation();
    for (const route of routes) {
        if (matchPath({ path: route.path, end: false }, location.pathname)) {
            return <>{route.element}</>;
        }
    }
    return <>{children}</>;
}

test("Subrote other route hidden", async () => {
    function Cmp1() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <SwitchRoutes routes={[{ path: `${urlPrefix}/sub`, element: <div>Cmp1 Sub</div> }]}>
                <SubRouteIndexRoute>
                    <div>
                        <Link to={`${urlPrefix}/sub`}>Cmp1 SubLink</Link>
                    </div>
                </SubRouteIndexRoute>
            </SwitchRoutes>
        );
    }

    function Cmp2() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <SwitchRoutes routes={[{ path: `${urlPrefix}/sub`, element: <Cmp2Inner /> }]}>
                <SubRouteIndexRoute>
                    <div>
                        <Link to={`${urlPrefix}/sub`}>Cmp2 SubLink</Link>
                    </div>
                </SubRouteIndexRoute>
            </SwitchRoutes>
        );
    }

    function Cmp2Inner() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <div>
                <Link to={`${urlPrefix}/sub`}>Sub</Link>
                <br />
                <Link to={`${urlPrefix}/sub/sub2`}>Sub2</Link>
                <SwitchRoutes routes={[{ path: `${urlPrefix}/sub/sub2`, element: <div>Cmp2 Sub2</div> }]}>
                    <div>Cmp2 Sub</div>
                </SwitchRoutes>
            </div>
        );
    }

    function Story() {
        return (
            <div>
                <SubRoute path="/cmp1">
                    <div>
                        <Cmp1 />
                    </div>
                </SubRoute>
                <SubRoute path="/cmp2">
                    <div>
                        <Cmp2 />
                    </div>
                </SubRoute>
            </div>
        );
    }

    const rendered = render(<Story />);

    fireEvent.click(rendered.getByText("Cmp1 SubLink"));

    await waitFor(() => {
        expect(rendered.getByText("Cmp1 Sub")).toBeInTheDocument();
    });
    expect(rendered.queryByText("Cmp2 SubLink")).not.toBeInTheDocument();
});

test("Subrote other route hidden 2", async () => {
    function Cmp1() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <SwitchRoutes routes={[{ path: `${urlPrefix}/sub`, element: <div>Cmp1 Sub</div> }]}>
                <SubRouteIndexRoute>
                    <div>
                        <Link to={`${urlPrefix}/sub`}>Cmp1 SubLink</Link>
                    </div>
                </SubRouteIndexRoute>
            </SwitchRoutes>
        );
    }

    function Cmp2() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <SwitchRoutes routes={[{ path: `${urlPrefix}/sub`, element: <Cmp2Inner /> }]}>
                <SubRouteIndexRoute>
                    <div>
                        <Link to={`${urlPrefix}/sub`}>Cmp2 SubLink</Link>
                    </div>
                </SubRouteIndexRoute>
            </SwitchRoutes>
        );
    }

    function Cmp2Inner() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <div>
                <Link to={`${urlPrefix}/sub`}>Sub</Link>
                <br />
                <Link to={`${urlPrefix}/sub/sub2`}>Sub2</Link>
                <SwitchRoutes routes={[{ path: `${urlPrefix}/sub/sub2`, element: <div>Cmp2 Sub2</div> }]}>
                    <div>Cmp2 Sub</div>
                </SwitchRoutes>
            </div>
        );
    }

    function Story() {
        return (
            <div>
                <SubRoute path="/cmp1">
                    <div>
                        <Cmp1 />
                    </div>
                </SubRoute>
                <SubRoute path="/cmp2">
                    <div>
                        <Cmp2 />
                    </div>
                </SubRoute>
            </div>
        );
    }

    const rendered = render(<Story />);

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

test("Route below Subroute", async () => {
    function Cmp2() {
        const urlPrefix = useSubRoutePrefix();
        return <div>urlPrefix={urlPrefix}</div>;
    }
    function Cmp1() {
        const urlPrefix = useSubRoutePrefix();
        const location = useLocation();
        const isSubMatch = matchPath({ path: `${urlPrefix}/sub`, end: false }, location.pathname);
        return (
            <>
                <Link to={`${urlPrefix}/sub`}>Sub</Link>
                {isSubMatch && (
                    <SubRoute path={`${urlPrefix}/sub`}>
                        <Cmp2 />
                    </SubRoute>
                )}
            </>
        );
    }
    function Story() {
        return (
            <SubRoute path="/foo">
                <Cmp1 />
            </SubRoute>
        );
    }

    const rendered = render(<Story />);

    fireEvent.click(rendered.getByText("Sub"));
    expect(rendered.getByText("urlPrefix=/foo/sub")).toBeInTheDocument();
});

test("SubRouteIndexRoute nested Switch", async () => {
    function Cmp1() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <SwitchRoutes routes={[{ path: `${urlPrefix}/cmp1-sub`, element: <div>Cmp1 Sub</div> }]}>
                <SubRouteIndexRoute>
                    <div>
                        <Link to={`${urlPrefix}/cmp1-sub`}>Cmp1 SubLink</Link>
                    </div>
                </SubRouteIndexRoute>
            </SwitchRoutes>
        );
    }

    function Story() {
        const urlPrefix = useSubRoutePrefix();
        return (
            <SwitchRoutes routes={[{ path: `${urlPrefix}/sub1`, element: <div>Sub1</div> }]}>
                <SubRouteIndexRoute>
                    <Cmp1 />
                </SubRouteIndexRoute>
            </SwitchRoutes>
        );
    }

    const rendered = render(<Story />);

    fireEvent.click(rendered.getByText("Cmp1 SubLink"));

    await waitFor(() => {
        expect(rendered.getByText("Cmp1 Sub")).toBeInTheDocument();
    });
});
