import { FormPaper } from "@comet/admin";
import { IMakeRteApiProps, makeRteApi, OnDebouncedContentChangeFn, Rte } from "@comet/admin-rte";
import { Box } from "@material-ui/core";
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
    const [saveableContent, setSaveableContent] = React.useState<Markdown>(defaultValue);

    const handleDebouncedContentChange: OnDebouncedContentChangeFn = (innerEditorState, convertStateToRawContent) => {
        setSaveableContent(convertStateToRawContent(innerEditorState));
    };
    const { editorState, setEditorState } = useRteApi({ defaultValue, onDebouncedContentChange: handleDebouncedContentChange });

    return (
        <>
            <Box marginBottom={4}>
                <FormPaper variant="outlined">
                    <Rte value={editorState} onChange={setEditorState} />
                </FormPaper>
            </Box>
            <PrintAnything label="Save Value: Markdown">{saveableContent}</PrintAnything>
        </>
    );
}

storiesOf("@comet/admin-rte/save-as", module).add("Save as MD", () => <Story />);
