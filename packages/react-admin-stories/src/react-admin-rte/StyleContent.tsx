import { storiesOf } from "@storybook/react";
import { IRteRef, makeRteApi, Rte } from "@vivid-planet/react-admin-rte";
import * as React from "react";
import { exampleContent, PrintEditorState, RteLayout, useAutoFocus } from "./helper";
import styled from "styled-components";

const [useRteApi] = makeRteApi();

const StyledRte = styled(Rte)`
    div.DraftEditor-root {
        font-family: monospace;
        line-height: 2;
    }
    div.DraftEditor-editorContainer,
    div.public-DraftEditor-content {
    }
`;

function Story() {
    const { editorState, setEditorState } = useRteApi({ defaultValue: JSON.stringify(exampleContent) }); // defaultValue is optional

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            <RteLayout>
                <StyledRte value={editorState} onChange={setEditorState} ref={editorRef} />
            </RteLayout>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("react-admin-rte", module).add("Rte, style Content", () => <Story />);
