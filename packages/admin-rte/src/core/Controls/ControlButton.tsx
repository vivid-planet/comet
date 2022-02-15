import { Theme } from "@mui/material/styles";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import getRteTheme from "../utils/getRteTheme";

export interface IProps {
    disabled?: boolean;
    selected?: boolean;
    onButtonClick?: (e: React.MouseEvent) => void;
    icon?: (props: SvgIconProps) => JSX.Element;
    children?: React.ReactNode;

    /** @deprecated use icon instead */
    Icon?: (props: SvgIconProps) => JSX.Element;
}

function ControlButton({
    disabled = false,
    selected = false,
    onButtonClick,
    icon,
    children,
    Icon: deprecatedIcon,
    classes,
}: IProps & WithStyles<typeof styles>) {
    const Icon = icon || deprecatedIcon;

    const rootClasses: string[] = [classes.root];
    if (selected) rootClasses.push(classes.selected);
    if (Icon) rootClasses.push(classes.renderAsIcon);

    return (
        <button className={rootClasses.join(" ")} disabled={disabled} onMouseDown={onButtonClick}>
            {!!Icon && <Icon fontSize="inherit" color="inherit" />}
            {children}
        </button>
    );
}

export type RteControlButtonClassKey = "root" | "selected" | "renderAsIcon";

const styles = (theme: Theme) => {
    // TODO: Fix this
    // @ts-ignore
    const rteTheme = getRteTheme(theme.props?.CometAdminRte);

    return createStyles<RteControlButtonClassKey, IProps>({
        root: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            height: 24,
            backgroundColor: "transparent",
            border: "1px solid transparent",
            boxSizing: "border-box",
            transition: "background-color 200ms, border-color 200ms, color 200ms",
            fontSize: 20,
            color: rteTheme.colors.buttonIcon,
            "&:hover": {
                backgroundColor: rteTheme.colors.buttonBackgroundHover,
                borderColor: rteTheme.colors.buttonBorderHover,
            },
            "&:disabled": {
                cursor: "not-allowed",
                "&, &:hover": {
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    color: rteTheme.colors.buttonIconDisabled,
                },
            },
        },
        selected: {
            "&:not(:disabled), &:not(:disabled):hover": {
                borderColor: rteTheme.colors.buttonBorderHover,
                backgroundColor: "white",
            },
        },
        renderAsIcon: {
            width: 24,
        },
    });
};

export default withStyles(styles, { name: "CometAdminRteControlButton" })(ControlButton);

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminRteControlButton: RteControlButtonClassKey;
    }
}
