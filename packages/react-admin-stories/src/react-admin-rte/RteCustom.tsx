import { storiesOf } from "@storybook/react";
import { IMakeRteApiProps, IRteApiProps, IRteOptions, IRteRef, makeRteApi, Rte } from "@vivid-planet/react-admin-rte";
import { convertFromRaw, convertToRaw, RawDraftContentState } from "draft-js";
import * as React from "react";
import { PrintEditorState, RteLayout, useAutoFocus } from "./helper";

const rteOptions: IRteOptions = {
    supports: ["bold", "italic", "header-one", "header-two", "ordered-list", "unordered-list"],
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
            <RteLayout>
                <Rte value={editorState} onChange={setEditorState} ref={editorRef} options={rteOptions} />
            </RteLayout>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("react-admin-rte", module).add("Rte, customized", () => <Story />);
