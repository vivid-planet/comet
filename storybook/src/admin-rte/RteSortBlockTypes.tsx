import { IRteOptions, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import * as React from "react";

const rteOptions: IRteOptions = {
    blocktypeMap: {
        "header-two": {}, // change the order of block-types
        unstyled: {},
        "header-three": {},
    },
};

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi();

    return (
        <Box marginBottom={4}>
            <Card variant="outlined">
                <CardContent>
                    <Rte value={editorState} onChange={setEditorState} options={rteOptions} />
                </CardContent>
            </Card>
        </Box>
    );
}

export default {
    title: "@comet/admin-rte",
};

export const RteSortBlockTypes = () => <Story />;

RteSortBlockTypes.storyName = "Rte, sort block types";
