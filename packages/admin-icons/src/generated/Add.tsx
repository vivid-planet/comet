import { SvgIcon, SvgIconProps } from "@material-ui/core";
import * as React from "react";

export default function Add(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props} viewBox="0 0 16 16">
            <path d="M8,2 C8.27614237,2 8.5,2.22385763 8.5,2.5 L8.5,7.5 L13.5,7.5 C13.7761424,7.5 14,7.72385763 14,8 C14,8.27614237 13.7761424,8.5 13.5,8.5 L8.499,8.5 L8.5,13.5 C8.5,13.7761424 8.27614237,14 8,14 C7.72385763,14 7.5,13.7761424 7.5,13.5 L7.499,8.5 L2.5,8.5 C2.22385763,8.5 2,8.27614237 2,8 C2,7.72385763 2.22385763,7.5 2.5,7.5 L7.5,7.5 L7.5,2.5 C7.5,2.22385763 7.72385763,2 8,2 Z" />
        </SvgIcon>
    );
}
