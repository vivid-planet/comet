import { storiesOf } from "@storybook/react";
import { IRteRef, makeRteApi, Rte } from "@vivid-planet/react-admin-rte";
import * as React from "react";
import { PrintEditorState, RteLayout, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi();

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            <RteLayout>
                <Rte value={editorState} onChange={setEditorState} ref={editorRef} />
            </RteLayout>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("react-admin-rte", module).add("Rte, minimal configuration", () => <Story />);
