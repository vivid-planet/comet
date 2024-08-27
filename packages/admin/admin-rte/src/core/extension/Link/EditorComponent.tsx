import { ContentState } from "draft-js";
import { PropsWithChildren } from "react";

interface IProps {
    contentState: ContentState;
    entityKey: string;
}

export interface ILinkProps {
    url: string;
}

const EditorComponent = (props: PropsWithChildren<IProps>) => {
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
};

export default EditorComponent;
