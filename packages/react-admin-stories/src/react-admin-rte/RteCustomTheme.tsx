import { storiesOf } from "@storybook/react";
import { IRteRef, IRteTheme, makeRteApi, Rte } from "@vivid-planet/react-admin-rte";
import * as React from "react";
import { exampleContent, PrintEditorState, RteLayout, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi({ defaultValue: JSON.stringify(exampleContent) }); // defaultValue is optional

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    const customRteTheme: IRteTheme = {
        colors: {
            border: "#bdbdff",
            toolbarBackground: "#f5f5ff",
            buttonIcon: "#7575ff",
            buttonIconDisabled: "#e0e0ff",
            buttonBackgroundHover: "#eeeeff",
            buttonBorderHover: "#bdbdff",
            buttonBorderDisabled: "#f5f5ff",
        },
    };

    return (
        <>
            <RteLayout>
                <Rte value={editorState} onChange={setEditorState} ref={editorRef} theme={customRteTheme} />
            </RteLayout>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("react-admin-rte", module).add("Rte, custom theme", () => <Story />);
