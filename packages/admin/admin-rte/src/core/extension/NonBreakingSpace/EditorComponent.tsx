import { RteNonBreakingSpace } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";
import { ContentState } from "draft-js";
import * as React from "react";

interface Props {
    contentState: ContentState;
    entityKey: string;
    children?: React.ReactNode;
}

function EditorComponent({ children }: Props): React.ReactElement {
    return (
        <>
            <Icon />
            {children}
        </>
    );
}

const Icon = styled(RteNonBreakingSpace)`
    position: relative;
    // Arbitrary values to make the icon look centered
    top: 0.19em;
    left: 0.14em;
    font-size: inherit;
    color: currentcolor;
    opacity: 0.5;
`;

export default EditorComponent;
