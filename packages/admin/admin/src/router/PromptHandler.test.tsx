import { type ReactNode } from "react";
import { matchPath, Navigate, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { cleanup, fireEvent, render, waitFor } from "test-utils";
import { afterEach, expect, test } from "vitest";

import { ForcePromptRoute } from "./ForcePromptRoute";
import { RouterPrompt } from "./Prompt";
import { useSubRoutePrefix } from "./SubRoute";

afterEach(cleanup);

/**
 * Helper component that acts like a v5 Switch+Route.
 */
function SwitchRoutes({ children, routes }: { children?: ReactNode; routes: Array<{ path: string; element: ReactNode; exact?: boolean }> }) {
    const location = useLocation();
    for (const route of routes) {
        if (matchPath({ path: route.path, end: route.exact ?? false }, location.pathname)) {
            return <>{route.element}</>;
        }
    }
    return <>{children}</>;
}

function MatchRoute({ path, children, exact }: { path: string; children: ReactNode; exact?: boolean }) {
    const location = useLocation();
    const match = matchPath({ path, end: exact ?? false }, location.pathname);
    if (!match) return null;
    return <>{children}</>;
}

test("Nested route in Prompt", async () => {
    function Story() {
        return (
            <SwitchRoutes
                routes={[
                    {
                        path: "/foo",
                        element: (
                            <RouterPrompt
                                message={() => {
                                    return "sure?";
                                }}
                                subRoutePath="/foo/s"
                            >
                                <Link to="/foo/s/sub">subLink</Link>
                                <MatchRoute path="/foo/s/sub">
                                    <div>sub</div>
                                </MatchRoute>
                            </RouterPrompt>
                        ),
                    },
                ]}
            >
                <Navigate to="/foo" replace />
            </SwitchRoutes>
        );
    }

    const rendered = render(<Story />);

    fireEvent.click(rendered.getByText("subLink"));

    // verify navigation to sub didn't get blocked
    await waitFor(() => {
        const sub = rendered.queryAllByText("sub");
        expect(sub.length).toBe(1);
    });
});

test("Nested dynamic route in Prompt", async () => {
    function FooPage() {
        const subRoutePrefix = useSubRoutePrefix();
        const location = useLocation();
        const subMatch = matchPath({ path: `${subRoutePrefix}/s/sub`, end: false }, location.pathname);
        return (
            <RouterPrompt
                message={() => {
                    return "sure?";
                }}
                subRoutePath={`${subRoutePrefix}/s`}
            >
                <Link to={`${subRoutePrefix}/s/sub`}>subLink</Link>
                <Link to={`${subRoutePrefix}`}>back</Link>
                {subMatch && <div>sub</div>}
            </RouterPrompt>
        );
    }
    function Story() {
        return (
            <SwitchRoutes
                routes={[
                    {
                        path: "/foo/:param",
                        element: <FooPage />,
                    },
                ]}
            >
                <Navigate to="/foo/paramvalue" replace />
            </SwitchRoutes>
        );
    }

    const rendered = render(<Story />);

    fireEvent.click(rendered.getByText("subLink"));

    // verify navigation to sub didn't get blocked
    await waitFor(() => {
        const sub = rendered.queryAllByText("sub");
        expect(sub.length).toBe(1);
    });

    fireEvent.click(rendered.getByText("back")); //go back again, navigating to /foo/:param

    // verify navigation to sub didn't get blocked
    await waitFor(() => {
        const sub = rendered.queryAllByText("sub");
        expect(sub.length).toBe(0);
    });
});

test("Nested route with non-sub-path route in Prompt", async () => {
    function Story() {
        return (
            <SwitchRoutes
                routes={[
                    {
                        path: "/foo",
                        element: (
                            <RouterPrompt
                                message={() => {
                                    return "sure?";
                                }}
                                subRoutePath="/foo/s"
                            >
                                <Link to="/foo/s/sub">subLink</Link>
                                <Link to="/foo">fooLink</Link>
                                <MatchRoute path="/foo" exact>
                                    <div>foo</div>
                                </MatchRoute>
                                <MatchRoute path="/foo/s/sub">
                                    <div>sub</div>
                                </MatchRoute>
                            </RouterPrompt>
                        ),
                    },
                ]}
            >
                <Navigate to="/foo" replace />
            </SwitchRoutes>
        );
    }

    const rendered = render(<Story />);

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
            <SwitchRoutes
                routes={[
                    {
                        path: "/",
                        exact: true,
                        element: (
                            <RouterPrompt
                                message={() => {
                                    return "sure?";
                                }}
                                subRoutePath="/s"
                            >
                                <Link to="/bar">barLink</Link>
                            </RouterPrompt>
                        ),
                    },
                    { path: "/bar", element: <>bar</> },
                ]}
            />
        );
    }

    const rendered = render(<Story />);

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

test("ForcePromptRoute", async () => {
    function Story() {
        const location = useLocation();
        const sub1Match = matchPath({ path: "/foo/sub1", end: false }, location.pathname);
        return (
            <SwitchRoutes
                routes={[
                    {
                        path: "/foo",
                        element: (
                            <RouterPrompt
                                message={() => {
                                    return "sure?";
                                }}
                                subRoutePath="/foo"
                            >
                                <ul>
                                    <li>
                                        <Link to="/foo/sub1">/foo/sub1</Link> (no prompt)
                                    </li>
                                    <li>
                                        <Link to="/foo/sub2">/foo/sub2</Link> (force prompt)
                                    </li>
                                    <li>
                                        <Link to="/foo">/foo</Link> (back)
                                    </li>
                                </ul>
                                {sub1Match && <div>sub1</div>}
                                <ForcePromptRoute path="/foo/sub2">
                                    <MatchRoute path="/foo/sub2">
                                        <div>sub2</div>
                                    </MatchRoute>
                                </ForcePromptRoute>
                            </RouterPrompt>
                        ),
                    },
                ]}
            >
                <Navigate to="/foo" replace />
            </SwitchRoutes>
        );
    }
    const rendered = render(<Story />);

    fireEvent.click(rendered.getByText("/foo/sub2"));

    // verify navigation to bar did get blocked
    await waitFor(() => {
        const sub = rendered.queryAllByText("sub2");
        expect(sub.length).toBe(0);
    });

    // and dirty dialog is shown
    await waitFor(() => {
        const sub = rendered.queryAllByText("sure?");
        expect(sub.length).toBe(1);
    });

    fireEvent.click(rendered.getByText("/foo/sub1"));

    // verify navigation didn't get blocked
    await waitFor(() => {
        const sub = rendered.queryAllByText("sub");
        expect(sub.length).toBe(0);
    });
});
