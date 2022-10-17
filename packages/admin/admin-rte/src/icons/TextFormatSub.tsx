import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import * as React from "react";

export default function TextFormatSub({ viewBox, ...props }: SvgIconProps) {
    return (
        <SvgIcon viewBox="0 0 100 100" {...props}>
            <path d="M80,65 L80,85 L75,85 L75,70 L70,70 L70,65 L80,65 Z M67,25 L67,35 L48.5357143,35 L48.5357143,75 L38.4642857,75 L38.4642857,35 L20,35 L20,25 L67,25 Z" />
        </SvgIcon>
    );
}
