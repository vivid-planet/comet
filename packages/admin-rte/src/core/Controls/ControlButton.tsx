import { createStyles, WithStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { withStyles } from "@material-ui/styles";
import * as React from "react";

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
    classes,
    disabled = false,
    selected = false,
    onButtonClick,
    icon,
    children,
    Icon: deprecatedIcon,
}: IProps & WithStyles<typeof styles>) {
    const Icon = icon || deprecatedIcon;

    const rootClasses: string[] = [classes.root];
    if (selected) rootClasses.push(classes.selected);
    if (disabled) rootClasses.push(classes.disabled);
    if (Icon) rootClasses.push(classes.renderAsIcon);

    return (
        <button className={rootClasses.join(" ")} disabled={disabled} onMouseDown={onButtonClick}>
            {!!Icon && <Icon fontSize="inherit" color="inherit" />}
            {children}
        </button>
    );
}

export type CometAdminRteControlButtonClassKeys = "root" | "selected" | "disabled" | "renderAsIcon";

const styles = (theme: Theme) =>
    createStyles<CometAdminRteControlButtonClassKeys, any>({
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
            color: theme.rte.colors.buttonIcon,
            "&:hover": {
                backgroundColor: theme.rte.colors.buttonBackgroundHover,
                borderColor: theme.rte.colors.buttonBorderHover,
            },
        },
        selected: {
            "&:not($disabled), &:not($disabled):hover": {
                borderColor: theme.rte.colors.buttonBorderHover,
                backgroundColor: "white",
            },
        },
        disabled: {
            cursor: "not-allowed",
            "&, &:hover": {
                backgroundColor: "transparent",
                borderColor: "transparent",
                color: theme.rte.colors.buttonIconDisabled,
            },
        },
        renderAsIcon: {
            width: 24,
        },
    });

export default withStyles(styles, { name: "CometAdminRteControlButton" })(ControlButton);
