import { IRteRef, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { number } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PrintEditorState, useAutoFocus } from "./helper";

const [useRteApi] = makeRteApi();

/**
 * Development story for testing the max list level option.
 */
function Story() {
    const { editorState, setEditorState } = useRteApi({
        defaultValue: JSON.stringify({
            blocks: [
                {
                    key: "b3kag",
                    text: "Level 0",
                    type: "unordered-list-item",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "c76pu",
                    text: "Level 1",
                    type: "unordered-list-item",
                    depth: 1,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "73ucq",
                    text: "Level 2",
                    type: "unordered-list-item",
                    depth: 2,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "66giv",
                    text: "Level 3",
                    type: "unordered-list-item",
                    depth: 3,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "bii9q",
                    text: "Level 4",
                    type: "unordered-list-item",
                    depth: 4,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "62g0n",
                    text: "Level 0",
                    type: "ordered-list-item",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "drug5",
                    text: "Level 1",
                    type: "ordered-list-item",
                    depth: 1,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "8p2d7",
                    text: "Level 2",
                    type: "ordered-list-item",
                    depth: 2,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "82dql",
                    text: "Level 3",
                    type: "ordered-list-item",
                    depth: 3,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
                {
                    key: "4bk6s",
                    text: "Level 4",
                    type: "ordered-list-item",
                    depth: 4,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                },
            ],
            entityMap: {},
        }),
    });

    // focus the editor to see the cursor immediately
    const editorRef = React.useRef<IRteRef>();
    useAutoFocus(editorRef);

    return (
        <>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Rte
                            value={editorState}
                            onChange={setEditorState}
                            ref={editorRef}
                            options={{ listLevelMax: number("Max list level", 4, { min: 0, max: 4 }) }}
                        />
                    </CardContent>
                </Card>
            </Box>
            <PrintEditorState editorState={editorState} />
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Max list level", () => <Story />);
