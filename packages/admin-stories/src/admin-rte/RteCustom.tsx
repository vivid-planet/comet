import { FormPaper } from "@comet/admin";
import { IRteOptions, IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { Box } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PrintEditorState, useAutoFocus } from "./helper";

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
            <Box marginBottom={4}>
                <FormPaper variant="outlined">
                    <Box marginBottom={4}>
                        Copy and paste content from{" "}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://docs.google.com/document/d/1YjqkIMC3q4jAzy__-S4fb6mC_w9EssmA6aZbGYWFv80/edit#"
                        >
                            https://docs.google.com/document/d/1YjqkIMC3q4jAzy__-S4fb6mC_w9EssmA6aZbGYWFv80/edit#
                        </a>{" "}
                        to test filtering
                    </Box>
                    <Rte value={editorState} onChange={setEditorState} ref={editorRef} options={rteOptions} />
                </FormPaper>
            </Box>
            <FormPaper variant="outlined">
                <PrintEditorState editorState={editorState} />
            </FormPaper>
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Rte, customized", () => <Story />);
