import { css } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

interface ContentScopeIndicatorProps {
    variant?: "default" | "toolbar";
    global?: boolean;
}

export const ContentScopeIndicator: React.FunctionComponent<ContentScopeIndicatorProps> = ({ children, variant = "default", global = false }) => {
    return (
        <ScopeIndicator global={global} variant={variant}>
            <Content global={global}>{children}</Content>
            {variant === "toolbar" && <ToolbarIndicator global={global} />}
        </ScopeIndicator>
    );
};

interface ScopeIndicatorProps {
    variant: "default" | "toolbar";
    global: boolean;
}

const ScopeIndicator = styled("div", { shouldForwardProp: (prop) => prop !== "global" })<ScopeIndicatorProps>`
    position: ${({ variant }) => (variant === "toolbar" ? "fixed" : "absolute")};
    top: -12px;
    left: 0;
    z-index: 1201;
    background: ${({ theme, global }) => (global ? theme.palette.primary.main : "#596980")};
    border-top-left-radius: 12px;
    border-bottom-right-radius: 12px;
    padding: 2px 12px;
    color: white;
    display: flex;
    align-items: center;

    ${({ variant, theme, global }) =>
        variant === "toolbar" &&
        css`
            top: 48px;
            left: auto;

            &:before {
                content: "";
                position: absolute;
                top: 8px;
                bottom: 0;
                right: 0;
                left: 0;
                width: 4px;
                height: 85px;
                background-color: ${global ? theme.palette.primary.main : "#596980"};
            }
        `}
`;

const ToolbarIndicator = styled("div", { shouldForwardProp: (prop) => prop !== "global" })<{ global: boolean }>`
    width: 4px;
    height: 100%;
    background-color: ${({ theme, global }) => (global ? theme.palette.primary.main : "#596980")};
`;

const Content = styled("div", { shouldForwardProp: (prop) => prop !== "global" })<{ global: boolean }>`
    background: ${({ theme, global }) => (global ? theme.palette.primary.main : "#596980")};
    border-top-left-radius: 12px;
    border-bottom-right-radius: 12px;
    padding: 2px 12px;
    color: white;
    display: flex;
    align-items: center;
`;
