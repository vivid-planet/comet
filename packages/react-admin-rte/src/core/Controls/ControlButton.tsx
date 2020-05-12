import { SvgIconProps } from "@material-ui/core/SvgIcon";
import * as React from "react";
import { IColors } from "../Rte";
import * as sc from "./ControlButton.sc";

export interface IProps {
    disabled?: boolean;
    selected?: boolean;
    onButtonClick?: (e: React.MouseEvent) => void;
    Icon?: (props: SvgIconProps) => JSX.Element;
    children?: React.ReactNode;
    colors: IColors;
}

export default function ControlButton({ disabled = false, selected = false, onButtonClick, Icon, children, colors }: IProps) {
    return (
        <sc.Root selected={selected} disabled={disabled} onMouseDown={onButtonClick} renderAsIcon={!!Icon} colors={colors}>
            {!!Icon && <Icon fontSize="inherit" color="inherit" />}
            {children}
        </sc.Root>
    );
}
