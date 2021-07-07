import { Link } from "@material-ui/core";
import React, { PropsWithChildren } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useStackSwitchApi } from "./Switch";

interface StackLinkProps {
    pageName: string;
    payload: string;
    subUrl?: string;
}

export const StackLink = ({ pageName, payload, subUrl, children }: PropsWithChildren<StackLinkProps>): React.ReactElement => {
    const stackApi = useStackSwitchApi();
    const url = React.useMemo(() => stackApi.getTargetUrl(pageName, payload, subUrl), [pageName, payload, stackApi, subUrl]);

    return (
        <Link to={url} component={RouterLink}>
            {children}
        </Link>
    );
};
