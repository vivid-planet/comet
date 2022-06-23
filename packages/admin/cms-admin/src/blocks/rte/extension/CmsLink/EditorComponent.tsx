import { ContentState } from "draft-js";
import * as React from "react";

interface IProps {
    contentState: ContentState;
    entityKey: string;
    children?: React.ReactNode;
}

export function EditorComponent(props: IProps): React.ReactElement {
    return (
        <a
            href="#"
            onClick={() => {
                // noop
            }}
        >
            {props.children}
        </a>
    );
}
