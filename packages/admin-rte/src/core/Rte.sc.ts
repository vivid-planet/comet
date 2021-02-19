import styled, { css } from "styled-components";

export const Root = styled.div`
    border: 1px solid ${({ theme }) => theme.rte.colors.border};
    border-top-width: 0;
`;

export const EditorWrapper = styled.div<{ disabled?: boolean }>`
    ${({ disabled, theme }) =>
        disabled &&
        css`
            &&& {
                color: ${theme.palette.text.disabled};
            }
        `};

    .public-DraftEditor-content {
        min-height: 240px;
        padding: 20px;
        box-sizing: border-box;
    }
`;
