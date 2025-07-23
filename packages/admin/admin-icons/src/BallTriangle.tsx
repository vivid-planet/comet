import { SvgIcon, type SvgIconProps } from "@mui/material";

export default function BallTriangle(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 57 57">
            <g transform="translate(1 1)" strokeWidth="2" fill="none" fillRule="evenodd">
                <circle cx="5" cy="50" r="5" fill="#29B6F6">
                    <animate attributeName="cy" begin="0s" dur="2.2s" values="50;5;50;50" calcMode="linear" repeatCount="indefinite" />
                    <animate attributeName="cx" begin="0s" dur="2.2s" values="5;27;49;5" calcMode="linear" repeatCount="indefinite" />
                </circle>
                <circle cx="27" cy="5" r="5" fill="#73E8FF">
                    <animate attributeName="cy" begin="0s" dur="2.2s" from="5" to="5" values="5;50;50;5" calcMode="linear" repeatCount="indefinite" />
                    <animate
                        attributeName="cx"
                        begin="0s"
                        dur="2.2s"
                        from="27"
                        to="27"
                        values="27;49;5;27"
                        calcMode="linear"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="49" cy="50" r="5" fill="#0086C3">
                    <animate attributeName="cy" begin="0s" dur="2.2s" values="50;50;5;50" calcMode="linear" repeatCount="indefinite" />
                    <animate
                        attributeName="cx"
                        from="49"
                        to="49"
                        begin="0s"
                        dur="2.2s"
                        values="49;5;27;49"
                        calcMode="linear"
                        repeatCount="indefinite"
                    />
                </circle>
            </g>
        </SvgIcon>
    );
}
