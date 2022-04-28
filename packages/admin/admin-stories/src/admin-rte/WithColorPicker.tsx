import { colorStyleFn, createColorPickerToolbarButton, IRteOptions, IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PrintEditorState, useAutoFocus } from "./helper";

const ColorPickerToolbarButton = createColorPickerToolbarButton();

const rteOptions: IRteOptions = {
    supports: ["header-one", "header-two", "header-three", "italic", "bold", "strikethrough", "history"],
    customToolbarButtons: [ColorPickerToolbarButton],
    draftJsProps: {
        customStyleFn: colorStyleFn,
    },
};

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi();

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            <Rte value={editorState} onChange={setEditorState} ref={editorRef} options={rteOptions} />
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Color picker", () => <Story />);
