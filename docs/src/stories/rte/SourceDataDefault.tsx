import { makeRteApi, Rte } from "@comet/admin-rte";
import * as React from "react";

const [useRteApi, { convertStateToRawContent }] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi({
        defaultValue: JSON.stringify({
            blocks: [
                { key: "1g5a1", text: "Headline 1", type: "header-one", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
                { key: "4qaer", text: "Pragraph", type: "unstyled", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
            ],
            entityMap: {},
        }),
    });

    return (
        <>
            <Rte value={editorState} onChange={setEditorState} />

            <p>Send this to the server:</p>
            <PrettyJson>{convertStateToRawContent(editorState)}</PrettyJson>
        </>
    );
}

const PrettyJson: React.FC<{ children: string }> = ({ children }) => <pre>{JSON.stringify(JSON.parse(children), null, 2)}</pre>;

export default Story();
