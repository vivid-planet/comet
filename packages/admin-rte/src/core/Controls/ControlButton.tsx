import { makeStyles } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import * as React from "react";

import { mergeClasses } from "../../mergeClasses"; // TODO: Import form "@comet/admin" after next release
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
    classes: passedClasses,
}: IProps & StyledComponentProps<CometAdminRteControlButtonClassKeys>) {
    const Icon = icon || deprecatedIcon;
    const classes = mergeClasses<CometAdminRteControlButtonClassKeys>(useStyles(), passedClasses);

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

export type CometAdminRteControlButtonClassKeys = "root" | "selected" | "renderAsIcon";

const useStyles = makeStyles<Theme, {}, CometAdminRteControlButtonClassKeys>(
    (theme: Theme) => {
        const rteTheme = getRteTheme(theme.props?.CometAdminRte);

        return {
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
                    color: "red",
                },
            },
            renderAsIcon: {
                width: 24,
            },
        };
    },
    { name: "CometAdminRteControlButton" },
);

export default ControlButton;
