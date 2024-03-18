import { messages } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { SvgIconProps, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ContentScopeIndicatorProps {
    global?: boolean;
    scopeLabels?: React.ReactNode[];
}

export const ContentScopeIndicator = ({ global = false, scopeLabels = [] }: ContentScopeIndicatorProps) => {
    const theme = useTheme();

    let content: React.ReactNode;
    if (global) {
        content = <FormattedMessage {...messages.globalContentScope} />;
    } else {
        content = scopeLabels?.reduce<React.ReactNode[]>((nodes, scope, idx, arr) => {
            const key = String(idx);
            const ret = [...nodes, <span key={key}>{scope}</span>];

            if (idx < arr.length - 1) {
                ret.push(<span key={`${key}-/`}>/</span>);
            }

            return ret;
        }, []);
    }

    return (
        <Wrapper>
            <ScopeIndicator global={global}>
                <DomainIcon />
                {content}
            </ScopeIndicator>
            <Triangle fill={global ? theme.palette.primary.dark : theme.palette.grey.A100} />
        </Wrapper>
    );
};

const Wrapper = styled("div")`
    display: inline-flex;
    height: 24px;
    align-items: center;
    flex-shrink: 0;
`;

interface ScopeIndicatorProps {
    global: boolean;
}

const ScopeIndicator = styled("div", { shouldForwardProp: (prop) => prop !== "global" })<ScopeIndicatorProps>`
    display: flex;
    height: 24px;
    padding: 0 5px 0 12px;
    align-items: center;
    gap: 5px;

    border-radius: 4px 0 0 4px;
    background: ${({ theme, global }) => (global ? theme.palette.primary.dark : theme.palette.grey.A100)};

    color: #fff;
    font-size: 12px;
    font-weight: ${({ global }) => (global ? 600 : 400)};
    line-height: 16px;
    text-transform: ${({ global }) => (global ? "uppercase" : "none")};
`;

const DomainIcon = styled(Domain)`
    font-size: 12px;
`;

const Triangle = (props: SvgIconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="24" viewBox="0 0 8 24" fill="currentColor" {...props}>
        <path d="m0 0 7.26 10.89a2 2 0 0 1 0 2.22L0 24V0Z" />
    </svg>
);
