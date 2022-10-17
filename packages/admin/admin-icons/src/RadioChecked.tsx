import { SvgIcon, SvgIconProps } from "@mui/material";
import * as React from "react";

export default function RadioChecked(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props} viewBox="0 0 16 16">
            <g fillRule="evenodd">
                <circle className="background" cx="8" cy="8" r="8" />
                <circle className="circle" cx="8" cy="8" r="3.5" />
            </g>
        </SvgIcon>
    );
}
