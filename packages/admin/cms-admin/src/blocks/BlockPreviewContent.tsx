import { BlockInterface, BlockPreview, useBlockContext } from "@comet/blocks-admin";
import * as React from "react";

export function BlockPreviewContent(props: { title?: React.ReactNode; block: BlockInterface; state?: unknown; input?: unknown }) {
    const context = useBlockContext();
    const state = props.state ? props.state : props.block.input2State(props.input);
    const previewContent = props.block.previewContent(state, context);
    return <BlockPreview title={props.title || ""} content={previewContent} />;
}
