import React, { PropsWithChildren } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { IStackSwitchApi, useStackSwitchApi } from "./Switch";

interface StackLinkProps extends Omit<RouterLinkProps, "to"> {
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
    ...props
}: PropsWithChildren<StackLinkProps>): React.ReactElement => {
    const internalSwitchApi = useStackSwitchApi();
    // external switchApi allows the creation of StackLinks outside of the stack with the useStackSwitch() hook
    const _switchApi = externalSwitchApi !== undefined ? externalSwitchApi : internalSwitchApi;

    return (
        <RouterLink to={() => _switchApi.getTargetUrl(pageName, payload, subUrl)} {...props}>
            {children}
        </RouterLink>
    );
};
