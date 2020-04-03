import { ContentState } from "draft-js";
import * as React from "react";

interface IProps {
    contentState: ContentState;
    entityKey: string;
    children?: React.ReactNode;
}

export interface ILinkProps {
    url: string;
}

function EditorComponent(props: IProps) {
    const { url } = props.contentState.getEntity(props.entityKey).getData() as ILinkProps; // not typed
    return (
        <a
            href={url}
            style={{
                color: "#3b5998",
                textDecoration: "underline",
            }}
        >
            {props.children}
        </a>
    );
}

export default EditorComponent;
