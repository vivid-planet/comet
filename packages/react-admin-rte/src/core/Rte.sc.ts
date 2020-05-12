import { styled } from "@vivid-planet/react-admin-mui";
import { IColors } from "./Rte";

interface IRootProps {
    colors: IColors;
}

export const Root = styled.div<IRootProps>`
    border: 1px solid ${({ colors }) => colors.border};
`;

export const EditorWrapper = styled.div`
    .public-DraftEditor-content {
        min-height: 240px;
        padding: 20px;
        box-sizing: border-box;
    }
`;
