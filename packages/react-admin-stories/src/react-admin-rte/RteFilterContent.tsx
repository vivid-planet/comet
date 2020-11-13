import { storiesOf } from "@storybook/react";
import {
    FilterEditorStateBeforeUpdateFn,
    filterEditorStateDefault,
    filterEditorUtilsManipulateEntityData,
    IRteRef,
    makeRteApi,
    Rte,
} from "@vivid-planet/react-admin-rte";
import { EditorState, EntityInstance } from "draft-js";
import * as React from "react";

import { PrintEditorState, RteLayout, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

const filterEditorStateBeforeUpdate: FilterEditorStateBeforeUpdateFn = (nextState: EditorState, ctx) => {
    const shouldFilter = nextState.getLastChangeType() === "insert-fragment";

    // this fn will strip out all attributes from link data and add 2 new attributes
    const changeLinkData = filterEditorUtilsManipulateEntityData((entity: EntityInstance) => {
        const data = entity.getData();
        const isLink = "LINK" === entity.getType();
        if (isLink && !data.linkType && data.url) {
            return { linkType: "external", targetUrl: data.url };
        }
        return undefined;
    });
    if (shouldFilter) {
        return changeLinkData(filterEditorStateDefault(nextState, ctx)); // apply default filter and then manipulate data in LINKS
    }
    return filterEditorStateDefault(nextState, ctx);
};

function Story() {
    const { editorState, setEditorState } = useRteApi();

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            <div style={{ padding: "10px" }}>
                <a href="https://google.com">Copy and paste this link into the editor</a>, and see in the editorstate that the link-data has changed
            </div>
            <RteLayout>
                <Rte value={editorState} onChange={setEditorState} ref={editorRef} options={{ filterEditorStateBeforeUpdate }} />
            </RteLayout>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("react-admin-rte", module).add("Rte, filter content", () => <Story />);
