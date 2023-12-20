import { RteSoftHyphen } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";
import { ContentState } from "draft-js";
import * as React from "react";

interface IProps {
    contentState: ContentState;
    entityKey: string;
    children?: React.ReactNode;
}

//TODO: Allow text selection for SoftHyphen
export function EditorComponent({ children }: IProps): React.ReactElement {
    return (
        <span>
            <VisibleHyphen />
            {children}
        </span>
    );
}

const VisibleHyphen = styled(RteSoftHyphen)`
    font-size: inherit;
    color: currentcolor;
    opacity: 0.5;

    // Arbitrary value to make the icon look centered
    padding-top: 0.2em;
`;
