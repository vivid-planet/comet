import { makeRteApi, Rte } from "@comet/admin-rte";
import { stateToMarkdown } from "draft-js-export-markdown";
import { stateFromMarkdown } from "draft-js-import-markdown";
import * as React from "react";

const [useRteApi, { convertStateToRawContent }] = makeRteApi({
    parse: (v) => {
        return stateFromMarkdown(v);
    },
    format: (v) => {
        return stateToMarkdown(v);
    },
});

export default {
    title: "stories/rte/Setup",
};

export const SourceDataMarkdown = {
    render: () => {
        const { editorState, setEditorState } = useRteApi({
            defaultValue: `
    # Headline 1
        
    This is markdown
        `,
        });

        return (
            <>
                <Rte value={editorState} onChange={setEditorState} />

                <p>Send this to the server:</p>
                <pre>{convertStateToRawContent(editorState)}</pre>
            </>
        );
    },

    name: "source-data-markdown",
};
