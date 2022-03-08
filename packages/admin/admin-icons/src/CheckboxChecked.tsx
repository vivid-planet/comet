import { SvgIcon, SvgIconProps } from "@material-ui/core";
import * as React from "react";

export default function CheckboxChecked(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props} viewBox="0 0 16 16">
            <g fillRule="evenodd">
                <rect className="background" width="16" height="16" rx="2" />
                <polygon className="checkIcon" points="6.176 10.197 3.805 7.834 3 8.636 6.176 11.8 13 5.002 12.195 4.2" />
            </g>
        </SvgIcon>
    );
}
