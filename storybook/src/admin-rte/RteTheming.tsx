import { makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { select } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const [useRteApi] = makeRteApi();

function Story() {
    const { editorState, setEditorState } = useRteApi();

    return (
        <>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Rte value={editorState} onChange={setEditorState} minHeight={select("minHeight", [0, 100, 200, 300, 1000], 0)} />
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Rte, minHeight", () => <Story />);
