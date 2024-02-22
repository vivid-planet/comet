import { makeRteApi, Rte } from "@comet/admin-rte";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const [useRteApi] = makeRteApi();

storiesOf("stories/rte/Setup", module).add("minimal", () => {
    const { editorState, setEditorState } = useRteApi();

    return <Rte value={editorState} onChange={setEditorState} />;
});
