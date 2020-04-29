import { SvgIconProps } from "@material-ui/core/SvgIcon";
import * as React from "react";
import * as sc from "./ControlButton.sc";

interface IProps {
    disabled?: boolean;
    selected?: boolean;
    onButtonClick?: (e: React.MouseEvent) => void;
    label?: string;
    Icon?: (props: SvgIconProps) => JSX.Element;
}

export default function ControlButton({ disabled = false, selected = false, onButtonClick, label = "", Icon }: IProps) {
    return (
        <sc.Root selected={selected} disabled={disabled} onMouseDown={onButtonClick}>
            {Icon ? <Icon fontSize="inherit" color="inherit" /> : label}
        </sc.Root>
    );
}
