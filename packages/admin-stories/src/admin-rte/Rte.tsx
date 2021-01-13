import { IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { exampleContent, PrintEditorState, RteLayout, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi({ defaultValue: JSON.stringify(exampleContent) }); // defaultValue is optional

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

storiesOf("@comet/admin-rte", module).add("Rte, minimal configuration", () => <Story />);
