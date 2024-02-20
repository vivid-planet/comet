import { SvgIcon, SvgIconProps } from "@mui/material";
import * as React from "react";

export default function UnsplashIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props} viewBox="0 0 32 32">
            <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" fill="#000000" fillRule="nonzero" />
        </SvgIcon>
    );
}
