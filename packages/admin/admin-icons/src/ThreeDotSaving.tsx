import { SvgIcon, type SvgIconProps } from "@mui/material";

export default function ThreeDotSaving(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 16 16">
            <circle cx="2.5" cy="8" r="2.5" fillOpacity="1">
                <animate
                    attributeName="r"
                    from="2.5"
                    to="2.5"
                    begin="0s"
                    dur="1s"
                    values="2.5;2;1.5;2;2.5"
                    calcMode="paced"
                    repeatCount="indefinite"
                />

                <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="1s" values="1;0;1" calcMode="paced" repeatCount="indefinite" />
            </circle>

            <circle cx="8" cy="8" r="2" fillOpacity="0.5">
                <animate attributeName="r" from="2" to="2" begin="0s" dur="1s" values="2;1.5;2;2.5;2" calcMode="paced" repeatCount="indefinite" />

                <animate
                    attributeName="fill-opacity"
                    from="0.5"
                    to="0.5"
                    begin="0s"
                    dur="1s"
                    values=".5;0;.5;1;0.5"
                    calcMode="paced"
                    repeatCount="indefinite"
                />
            </circle>

            <circle cx="13.5" cy="8" r="1.5" fillOpacity="0">
                <animate
                    attributeName="r"
                    from="1.5"
                    to="1.5"
                    begin="0s"
                    dur="1s"
                    values="1.5;2;2.5;2;1.5"
                    calcMode="paced"
                    repeatCount="indefinite"
                />

                <animate
                    attributeName="fill-opacity"
                    from="0"
                    to="0"
                    begin="0s"
                    dur="1s"
                    values="0;0.5;1;0.5;0"
                    calcMode="paced"
                    repeatCount="indefinite"
                />
            </circle>
        </SvgIcon>
    );
}
