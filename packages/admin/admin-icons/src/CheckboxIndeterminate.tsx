import { SvgIcon, type SvgIconProps } from "@mui/material";

export default function CheckboxIndeterminate(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 16 16">
            <g fillRule="evenodd">
                <rect className="background" width="16" height="16" rx="2" />
                <path
                    className="checkIcon"
                    d="M2.375 7.625H13.625C13.8321 7.625 14 7.79289 14 8C14 8.20711 13.8321 8.375 13.625 8.375H2.375C2.16789 8.375 2 8.20711 2 8C2 7.79289 2.16789 7.625 2.375 7.625Z"
                />
            </g>
        </SvgIcon>
    );
}
