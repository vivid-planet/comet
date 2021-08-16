import { Link, LinkBaseProps as MuiLinkBaseProps } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core/Typography";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import React, { PropsWithChildren } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { IStackSwitchApi, useStackSwitchApi } from "./Switch";

type LinkProps = Omit<RouterLinkProps, "to"> &
    Omit<MuiLinkBaseProps, "component"> & {
        TypographyClasses?: TypographyProps["classes"];
        underline?: "none" | "hover" | "always";
    };

interface StackLinkProps extends LinkProps {
    pageName: string;
    payload: string;
    subUrl?: string;
    switchApi?: IStackSwitchApi;
}

type CometAdminStackLinkClassKeys = "root";

const styles = () =>
    createStyles<CometAdminStackLinkClassKeys, any>({
        root: {},
    });

const StackLinkWithoutStyles = ({
    classes,
    pageName,
    payload,
    subUrl,
    switchApi: externalSwitchApi,
    children,
    ...props
}: WithStyles<typeof styles, false> & PropsWithChildren<StackLinkProps>): React.ReactElement => {
    const internalSwitchApi = useStackSwitchApi();
    // external switchApi allows the creation of StackLinks outside of the stack with the useStackSwitch() hook
    const _switchApi = externalSwitchApi !== undefined ? externalSwitchApi : internalSwitchApi;

    return (
        <Link classes={{ root: classes.root }} to={() => _switchApi.getTargetUrl(pageName, payload, subUrl)} component={RouterLink} {...props}>
            {children}
        </Link>
    );
};

export const StackLink = withStyles(styles, { name: "CometAdminStackLink" })(StackLinkWithoutStyles);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminStackLink: CometAdminStackLinkClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminStackLink: PropsWithChildren<StackLinkProps>;
    }
}
