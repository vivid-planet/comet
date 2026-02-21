import { SubRoute, SubRouteIndexRoute, useSubRoutePrefix } from "@comet/admin";
import { useEffect, useState } from "react";
import { matchPath, Navigate, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { storyRouterDecorator } from "../../story-router.decorator";

function Cmp1() {
    const urlPrefix = useSubRoutePrefix();
    const location = useLocation();
    return matchPath({ path: `${urlPrefix}/sub`, end: false }, location.pathname) ? (
        <div>Cmp1 Sub</div>
    ) : (
        <SubRouteIndexRoute>
            <div>
                <Link to={`${urlPrefix}/sub`}>Cmp1 SubLink</Link>
            </div>
        </SubRouteIndexRoute>
    );
}

function Cmp2() {
    const urlPrefix = useSubRoutePrefix();
    const location = useLocation();
    return matchPath({ path: `${urlPrefix}/sub`, end: false }, location.pathname) ? (
        <>
            <div>
                <Link to={`${urlPrefix}/sub`}>Sub</Link>
                <br />
                <Link to={`${urlPrefix}/sub/sub2`}>Sub2</Link>
            </div>
            {matchPath({ path: `${urlPrefix}/sub/sub2`, end: false }, location.pathname) ? <div>Cmp2 Sub2</div> : <div>Cmp2 Sub</div>}
        </>
    ) : (
        <SubRouteIndexRoute>
            <div>
                <Link to={`${urlPrefix}/sub`}>Cmp2 SubLink</Link>
            </div>
        </SubRouteIndexRoute>
    );
}

function Story() {
    const urlPrefix = useSubRoutePrefix();
    return (
        <div>
            <SubRoute path={`${urlPrefix}/cmp1`}>
                <div>
                    <Cmp1 />
                </div>
            </SubRoute>
            <SubRoute path={`${urlPrefix}/cmp2`}>
                <div>
                    <Cmp2 />
                </div>
            </SubRoute>
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

export const Subroute = () => {
    const location = useLocation();
    return (
        <>
            <Path />
            {matchPath({ path: "/", end: true }, location.pathname) ? <Navigate to="/foo" replace /> : <Story />}
        </>
    );
};
