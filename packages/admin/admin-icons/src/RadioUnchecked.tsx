import { SvgIcon, type SvgIconProps } from "@mui/material";

export default function RadioUnchecked(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 16 16">
            <g fillRule="evenodd">
                <circle className="border" cx="8" cy="8" r="8" />
                <path
                    className="background"
                    d="M8,0 C12.418278,0 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 C3.581722,16 0,12.418278 0,8 C0,3.581722 3.581722,0 8,0 Z M8,1 C4.13400675,1 1,4.13400675 1,8 C1,11.8659932 4.13400675,15 8,15 C11.8659932,15 15,11.8659932 15,8 C15,4.13400675 11.8659932,1 8,1 Z"
                />
            </g>
        </SvgIcon>
    );
}
