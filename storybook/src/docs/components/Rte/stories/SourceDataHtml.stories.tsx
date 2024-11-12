import { makeRteApi, Rte } from "@comet/admin-rte";
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

export default {
    title: "stories/rte/Setup",
};

export const SourceDataHtml = {
    render: () => {
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
    },

    name: "source-data-html",
};
