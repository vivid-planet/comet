import { ForcePromptRoute, RouterPrompt } from "@comet/admin";
import { useEffect, useState } from "react";
import { matchPath, Navigate, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    const location = useLocation();
    return matchPath({ path: "/foo", end: false }, location.pathname) ? (
        <RouterPrompt
            message={() => {
                return "rly?";
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
            {matchPath({ path: "/foo/sub1", end: false }, location.pathname) && <div>sub1</div>}
            <ForcePromptRoute path="/foo/sub2">{matchPath({ path: "/foo/sub2", end: false }, location.pathname) && <div>sub2</div>}</ForcePromptRoute>
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

export const _ForcePromptRoute = {
    render: () => {
        return (
            <>
                <Path />
                <Story />
            </>
        );
    },

    name: "ForcePromptRoute",
};
