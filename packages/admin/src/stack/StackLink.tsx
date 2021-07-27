import { Link } from "@material-ui/core";
import React, { PropsWithChildren } from "react";
import { Link as RouterLink } from "react-router-dom";

import { IStackSwitchApi, useStackSwitchApi } from "./Switch";

interface StackLinkProps {
    pageName: string;
    payload: string;
    subUrl?: string;
    switchApi?: IStackSwitchApi;
}

export const StackLink = ({
    pageName,
    payload,
    subUrl,
    switchApi: externalSwitchApi,
    children,
}: PropsWithChildren<StackLinkProps>): React.ReactElement => {
    const internalSwitchApi = useStackSwitchApi();
    // external switchApi allows the creation of StackLinks outside of the stack with the useStackSwitch() hook
    const _switchApi = externalSwitchApi !== undefined ? externalSwitchApi : internalSwitchApi;

    return (
        <Link to={() => _switchApi.getTargetUrl(pageName, payload, subUrl)} component={RouterLink}>
            {children}
        </Link>
    );
};
