import { makeRteApi, Rte } from "@comet/admin-rte";
import * as React from "react";

const [useRteApi] = makeRteApi();

export default {
    title: "stories/rte/Setup",
};

export const Minimal = () => {
    const { editorState, setEditorState } = useRteApi();

    return <Rte value={editorState} onChange={setEditorState} />;
};

Minimal.storyName = "minimal";
