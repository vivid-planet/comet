import { styled } from "@vivid-planet/react-admin-mui";

export const Root = styled.div`
    border: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;

export const EditorWrapper = styled.div`
    padding: 20px;
    box-sizing: border-box;
`;
