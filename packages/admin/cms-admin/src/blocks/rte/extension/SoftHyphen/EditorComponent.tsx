import { styled } from "@mui/material/styles";
import { ContentState } from "draft-js";
import * as React from "react";

interface IProps {
    contentState: ContentState;
    entityKey: string;
    children?: React.ReactNode;
}

const VisibleHyphen = styled("span")`
    color: #999;
    &:before {
        content: "[-]";
    }
`;

// children must be rendered, although &shy; is invisible
// https://github.com/facebook/draft-js/issues/1558

/**
 * @deprecated Use SoftHyphen `EditorComponent` from `@comet/admin-rte` instead
 */
export function EditorComponent(props: IProps): React.ReactElement {
    return <VisibleHyphen>{props.children}</VisibleHyphen>;
}
