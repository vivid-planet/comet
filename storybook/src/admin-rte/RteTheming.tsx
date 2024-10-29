import { makeRteApi, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { select } from "@storybook/addon-knobs";
import * as React from "react";

const [useRteApi] = makeRteApi();

export default {
    title: "@comet/admin-rte",
};

export const RteMinHeight = () => {
    const { editorState, setEditorState } = useRteApi();

    return (
        <Box marginBottom={4}>
            <Card variant="outlined">
                <CardContent>
                    <Rte value={editorState} onChange={setEditorState} minHeight={select("minHeight", [0, 100, 200, 300, 1000], 0)} />
                </CardContent>
            </Card>
        </Box>
    );
};

RteMinHeight.storyName = "Rte, minHeight";
