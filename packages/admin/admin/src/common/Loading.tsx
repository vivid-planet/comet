import { BallTriangle } from "@comet/admin-icons";
import { SvgIconProps } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import React from "react";

export interface LoadingProps extends SvgIconProps {
    behavior?: "auto" | "fillParent" | "fillParentAbsolute" | "fillPageHeight";
}

export const Loading = ({ behavior = "auto", fontSize, sx, ...svgIconsProps }: LoadingProps) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const offsetTop = rootRef.current?.offsetTop || 0;

    return (
        <Root ref={rootRef} style={{ "--comet-admin-loading-offset-top": `${offsetTop}px` } as React.CSSProperties} behavior={behavior}>
            <LoadingContainer behavior={behavior}>
                <BallTriangle sx={{ fontSize: fontSize ?? 40, ...sx }} {...svgIconsProps} />
            </LoadingContainer>
        </Root>
    );
};

const Root = styled("div")<Required<Pick<LoadingProps, "behavior">>>`
    position: relative;

    ${({ behavior }) => {
        if (behavior === "fillParent") {
            return css`
                height: 100%;
                flex-grow: 1;
            `;
        }

        if (behavior === "fillParentAbsolute") {
            return css`
                position: absolute;
                inset: 0;
            `;
        }

        if (behavior === "fillPageHeight") {
            return css`
                height: calc(100vh - var(--comet-admin-loading-offset-top));
            `;
        }
    }}
`;

const LoadingContainer = styled("div")<Required<Pick<LoadingProps, "behavior">>>`
    text-align: center;

    ${({ behavior }) =>
        behavior !== "auto" &&
        css`
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        `}
`;
