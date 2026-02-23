import { SubRouteIndexRoute, useSubRoutePrefix } from "@comet/admin";
import { useEffect, useState } from "react";
import { matchPath, Navigate, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { storyRouterDecorator } from "../../story-router.decorator";

function Cmp1() {
    const urlPrefix = useSubRoutePrefix();
    const location = useLocation();
    return (
        <div>
            {matchPath({ path: `${urlPrefix}/sub`, end: false }, location.pathname) ? (
                <p>Cmp1-Sub</p>
            ) : (
                <SubRouteIndexRoute>
                    <p>Cmp1-Index</p>
                    <Link to={`${urlPrefix}/sub`}>to-cmp1-sub</Link>
                </SubRouteIndexRoute>
            )}
        </div>
    );
}

function Story() {
    const location = useLocation();
    return (
        <div>
            {matchPath({ path: "/sub", end: false }, location.pathname) ? (
                <>Sub</>
            ) : (
                <SubRouteIndexRoute>
                    <Cmp1 />
                </SubRouteIndexRoute>
            )}
        </div>
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

export const SubrouteNestedIndex = {
    render: () => {
        const location = useLocation();
        return (
            <>
                <Path />
                {matchPath({ path: "/", end: true }, location.pathname) ? <Navigate to="/foo" replace /> : <Story />}
            </>
        );
    },

    name: "Subroute nested index",
};
