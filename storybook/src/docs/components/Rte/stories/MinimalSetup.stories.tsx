import { makeRteApi, Rte } from "@comet/admin-rte";
import * as React from "react";

const [useRteApi] = makeRteApi();

export default {
    title: "stories/rte/Setup",
};

export const Minimal = {
    render: () => {
        const { editorState, setEditorState } = useRteApi();

        return <Rte value={editorState} onChange={setEditorState} />;
    },

    name: "minimal",
};
