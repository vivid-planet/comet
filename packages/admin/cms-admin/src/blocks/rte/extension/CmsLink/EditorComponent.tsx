import { ContentState } from "draft-js";
import { PropsWithChildren } from "react";

interface IProps {
    contentState: ContentState;
    entityKey: string;
}

export function EditorComponent(props: PropsWithChildren<IProps>) {
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
