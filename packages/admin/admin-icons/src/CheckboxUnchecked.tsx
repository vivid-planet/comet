import { SvgIcon, type SvgIconProps } from "@mui/material";

export default function CheckboxUnchecked(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 16 16">
            <g fillRule="evenodd">
                <rect className="border" width="16" height="16" rx="2" />
                <path
                    className="background"
                    d="M14,0 C15.1045695,-2.02906125e-16 16,0.8954305 16,2 L16,14 C16,15.1045695 15.1045695,16 14,16 L2,16 C0.8954305,16 1.3527075e-16,15.1045695 0,14 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 L14,0 Z M13.5,1 L2.5,1 C1.67157288,1 1,1.67157288 1,2.5 L1,2.5 L1,13.5 C1,14.3284271 1.67157288,15 2.5,15 L2.5,15 L13.5,15 C14.3284271,15 15,14.3284271 15,13.5 L15,13.5 L15,2.5 C15,1.67157288 14.3284271,1 13.5,1 L13.5,1 Z"
                />
            </g>
        </SvgIcon>
    );
}
