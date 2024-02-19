import { TextField } from "@comet/admin";
import { BlockInterface, BlocksFinalForm, createBlockSkeleton, LinkBlockInterface } from "@comet/blocks-admin";
import { NewsLinkBlockData, NewsLinkBlockInput } from "@src/blocks.generated";
import * as React from "react";

type State = NewsLinkBlockData;

const NewsLinkBlock: BlockInterface<NewsLinkBlockData, State, NewsLinkBlockInput> & LinkBlockInterface<State> = {
    ...createBlockSkeleton(),

    name: "NewsLink",

    displayName: "News",

    defaultValues: () => ({}),

    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <TextField name="id" label="ID" fullWidth />
            </BlocksFinalForm>
        );
    },

    previewContent: (state) => (state.id !== undefined ? [{ type: "text", content: state.id }] : []),
};

export { NewsLinkBlock };
