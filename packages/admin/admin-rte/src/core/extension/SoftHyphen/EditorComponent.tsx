import { RteSoftHyphen } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";
import { ContentState } from "draft-js";
import * as React from "react";

interface IProps {
    contentState: ContentState;
    entityKey: string;
    children?: React.ReactNode;
}

export function EditorComponent(props: IProps): React.ReactElement {
    return (
        <span>
            <VisibleHyphen>{props.children}</VisibleHyphen>
        </span>
    );
}

const VisibleHyphen = styled(RteSoftHyphen)`
    color: #999;
`;
