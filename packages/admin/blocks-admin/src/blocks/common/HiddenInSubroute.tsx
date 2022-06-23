import * as React from "react";
import { Route, useRouteMatch } from "react-router";

interface Props {
    children: React.ReactNode;
}

export function HiddenInSubroute({ children }: Props): React.ReactElement {
    const match = useRouteMatch();

    return (
        <Route path={match.url} exact>
            {children}
        </Route>
    );
}
