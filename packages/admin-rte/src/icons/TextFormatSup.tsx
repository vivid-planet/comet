import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import * as React from "react";

export default function TextFormatSup({ viewBox, ...props }: SvgIconProps) {
    return (
        <SvgIcon viewBox="0 0 100 100" {...props}>
            <path d="M67,25 L67,35 L48.5357143,35 L48.5357143,75 L38.4642857,75 L38.4642857,35 L20,35 L20,25 L67,25 Z M80,15 L80,35 L75,35 L75,20 L70,20 L70,15 L80,15 Z" />
        </SvgIcon>
    );
}
