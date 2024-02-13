import { IMakeRteApiProps, makeRteApi, OnDebouncedContentChangeFn, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import { convertFromRaw, convertToRaw, RawDraftContentState } from "draft-js";
import * as React from "react";

import { PrintAnything } from "./helper";

const defaultValue: RawDraftContentState = {
    blocks: [
        {
            key: "3v61q",
            text: "save-format is rawDraftJsObject",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 15,
                    length: 16,
                    style: "BOLD",
                },
            ],
            entityRanges: [],
            data: {},
        },
        {
            key: "7cbdf",
            text: "",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
    ],
    entityMap: {},
};

const makeRteApiProps: IMakeRteApiProps<RawDraftContentState> = {
    parse: (v) => convertFromRaw(v),
    format: (v) => convertToRaw(v),
};

const [useRteApi] = makeRteApi<RawDraftContentState>(makeRteApiProps);

function Story() {
    const [savableContent, setSavableContent] = React.useState<RawDraftContentState>(defaultValue);

    const handleDebouncedContentChange: OnDebouncedContentChangeFn = (innerEditorState, convertStateToRawContent) => {
        setSavableContent(convertStateToRawContent(innerEditorState));
    };
    const { editorState, setEditorState } = useRteApi({ defaultValue, onDebouncedContentChange: handleDebouncedContentChange });

    return (
        <>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Rte value={editorState} onChange={setEditorState} />
                    </CardContent>
                </Card>
            </Box>
            <PrintAnything label="Save Value: RawDraftJs (not stringified)">{savableContent}</PrintAnything>
        </>
    );
}

storiesOf("@comet/admin-rte/save-as", module).add("Save as Raw DraftJs Object", () => <Story />);
