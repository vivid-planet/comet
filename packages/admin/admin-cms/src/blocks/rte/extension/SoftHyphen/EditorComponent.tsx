import { ContentState } from "draft-js";
import * as React from "react";
import styled from "styled-components";

interface IProps {
    contentState: ContentState;
    entityKey: string;
    children?: React.ReactNode;
}

const VisibleHyphen = styled.span`
    color: #999;
    &:before {
        content: "[-]";
    }
`;

// children must be rendered, although &shy; is invisible
// https://github.com/facebook/draft-js/issues/1558

export function EditorComponent(props: IProps): React.ReactElement {
    return <VisibleHyphen>{props.children}</VisibleHyphen>;
}
