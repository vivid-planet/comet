import { makeRteApi, Rte } from "@comet/admin-rte";
import { storiesOf } from "@storybook/react";
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

storiesOf("stories/rte/Setup", module).add("source-data-markdown", () => {
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
});
