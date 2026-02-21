import { RouterPrompt } from "@comet/admin";
import { useEffect, useState } from "react";
import { matchPath, Navigate, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    const location = useLocation();
    return matchPath({ path: "/foo", end: false }, location.pathname) ? (
        <RouterPrompt
            message={() => {
                return "sure?";
            }}
            subRoutePath="/foo/s"
        >
            <Link to="/foo/s/sub">subLink</Link>
            <Link to="/foo">fooLink</Link>
            {matchPath({ path: "/foo", end: true }, location.pathname) && <div>foo</div>}
            {matchPath({ path: "/foo/s/sub", end: false }, location.pathname) && <div>sub</div>}
        </RouterPrompt>
    ) : (
        <Navigate to="/foo" replace />
    );
}

function Path() {
    const location = useLocation();
    const [, rerender] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            rerender(new Date().getTime());
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    return <div>{location.pathname}</div>;
}

export default {
    title: "@comet/admin/router",
    decorators: [storyRouterDecorator()],
};

export const NestedRouteWithNonSubPathRouteInPrompt = {
    render: () => {
        return (
            <>
                <Path />
                <Story />
            </>
        );
    },

    name: "Nested route with non-sub-path route in Prompt",
};
