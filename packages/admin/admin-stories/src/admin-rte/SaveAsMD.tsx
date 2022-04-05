import { IMakeRteApiProps, makeRteApi, OnDebouncedContentChangeFn, Rte } from "@comet/admin-rte";
import { Box, Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import { stateToMarkdown } from "draft-js-export-markdown";
import { stateFromMarkdown } from "draft-js-import-markdown";
import * as React from "react";

import { PrintAnything } from "./helper";

type Markdown = string;

const defaultValue: Markdown = `
# Headline 1

This is markdown
`;

const makeRteApiProps: IMakeRteApiProps<Markdown> = {
    parse: (v) => {
        return stateFromMarkdown(v);
    },
    format: (v) => {
        return stateToMarkdown(v);
    },
};

const [useRteApi] = makeRteApi<Markdown>(makeRteApiProps);

function Story() {
    const [savableContent, setSavableContent] = React.useState<Markdown>(defaultValue);

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
            <PrintAnything label="Save Value: Markdown">{savableContent}</PrintAnything>
        </>
    );
}

storiesOf("@comet/admin-rte/save-as", module).add("Save as MD", () => <Story />);
