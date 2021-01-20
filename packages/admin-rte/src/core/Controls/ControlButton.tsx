import { SvgIconProps } from "@material-ui/core/SvgIcon";
import * as React from "react";

import * as sc from "./ControlButton.sc";

export interface IProps {
    disabled?: boolean;
    selected?: boolean;
    onButtonClick?: (e: React.MouseEvent) => void;
    icon?: (props: SvgIconProps) => JSX.Element;
    children?: React.ReactNode;

    /** @deprecated use icon instead */
    Icon?: (props: SvgIconProps) => JSX.Element;
}

export default function ControlButton({ disabled = false, selected = false, onButtonClick, icon, children, Icon: deprecatedIcon }: IProps) {
    const Icon = icon || deprecatedIcon;
    return (
        <sc.Root selected={selected} disabled={disabled} onMouseDown={onButtonClick} renderAsIcon={!!Icon}>
            {!!Icon && <Icon fontSize="inherit" color="inherit" />}
            {children}
        </sc.Root>
    );
}
