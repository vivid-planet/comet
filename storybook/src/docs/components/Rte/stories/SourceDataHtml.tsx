import { makeRteApi, Rte } from "@comet/admin-rte";
import { storiesOf } from "@storybook/react";
import { ContentState, convertFromHTML } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import * as React from "react";

type Html = string;

const [useRteApi, { convertStateToRawContent }] = makeRteApi<Html>({
    parse: (v) => {
        const blocksFromHTML = convertFromHTML(v);
        return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
    },
    format: (v) => {
        return stateToHTML(v);
    },
});

storiesOf("stories/rte/Setup", module).add("source-data-html", () => {
    const { editorState, setEditorState } = useRteApi({
        defaultValue: `
<h1>Headline 1</h1>
<p>This is html</p>
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
