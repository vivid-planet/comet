import { IRteOptions, makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
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
        <>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Rte value={editorState} onChange={setEditorState} options={rteOptions} />
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Rte, sort block types", () => <Story />);
