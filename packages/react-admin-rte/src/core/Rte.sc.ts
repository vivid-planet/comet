import { styled } from "@vivid-planet/react-admin-mui";

export const Root = styled.div`
    border: 1px solid ${({ theme }) => theme.rte.colors.border};
`;

export const EditorWrapper = styled.div`
    .public-DraftEditor-content {
        min-height: 240px;
        padding: 20px;
        box-sizing: border-box;
    }
`;
