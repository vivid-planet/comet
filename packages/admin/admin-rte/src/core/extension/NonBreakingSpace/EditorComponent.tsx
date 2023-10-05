import { styled } from "@mui/material/styles";
import { ContentState } from "draft-js";
import * as React from "react";

interface Props {
    contentState: ContentState;
    entityKey: string;
    children?: React.ReactNode;
}

function EditorComponent({ children }: Props): React.ReactElement {
    return <VisibleHyphen>{children}</VisibleHyphen>;
}

const VisibleHyphen = styled("span")`
    color: #999;
    &:before {
        margin-right: -4px; // Compensate for the non-breaking space that is added by the browser
        content: "[+]";
    }
`;

export default EditorComponent;
