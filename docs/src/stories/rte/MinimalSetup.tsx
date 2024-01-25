import { makeRteApi, Rte } from "@comet/admin-rte";
import * as React from "react";

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi();

    return <Rte value={editorState} onChange={setEditorState} />;
}
export default Story();
