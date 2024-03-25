import React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { IStackSwitchApi, useStackSwitchApi } from "./Switch";

type StackLinkProps = {
    pageName: string;
    payload: string;
    subUrl?: string;
    switchApi?: IStackSwitchApi;
} & Omit<RouterLinkProps, "to">;

export const StackLink = React.forwardRef<HTMLAnchorElement, StackLinkProps>(
    ({ switchApi: externalSwitchApi, payload, pageName, subUrl, children, ...props }, ref) => {
        const internalSwitchApi = useStackSwitchApi();
        // external switchApi allows the creation of StackLinks outside of the stack with the useStackSwitch() hook
        const _switchApi = externalSwitchApi !== undefined ? externalSwitchApi : internalSwitchApi;

        return (
            <RouterLink ref={ref} to={() => _switchApi.getTargetUrl(pageName, payload, subUrl)} {...props}>
                {children}
            </RouterLink>
        );
    },
);
