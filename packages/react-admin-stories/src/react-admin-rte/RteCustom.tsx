import { storiesOf } from "@storybook/react";
import { IRteOptions, IRteRef, makeRteApi, Rte } from "@vivid-planet/react-admin-rte";
import * as React from "react";

import { PrintEditorState, RteLayout, useAutoFocus } from "./helper";

const rteOptions: IRteOptions = {
    supports: ["italic", "header-one", "header-two", "ordered-list", "unordered-list"],
    listLevelMax: 3,
};

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi();

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            Copy and paste content from{" "}
            <a target="_blank" rel="noreferrer" href="https://docs.google.com/document/d/1YjqkIMC3q4jAzy__-S4fb6mC_w9EssmA6aZbGYWFv80/edit#">
                https://docs.google.com/document/d/1YjqkIMC3q4jAzy__-S4fb6mC_w9EssmA6aZbGYWFv80/edit#
            </a>{" "}
            to test filtering
            <RteLayout>
                <Rte value={editorState} onChange={setEditorState} ref={editorRef} options={rteOptions} />
            </RteLayout>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("react-admin-rte", module).add("Rte, customized", () => <Story />);
