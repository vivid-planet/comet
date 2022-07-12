import { Field, FinalFormInput } from "@comet/admin";
import { BlockInterface, BlocksFinalForm, createBlockSkeleton } from "@comet/blocks-admin";
import { NewsLinkBlockData, NewsLinkBlockInput } from "@src/blocks.generated";
import * as React from "react";

const NewsLinkBlock: BlockInterface<NewsLinkBlockData, NewsLinkBlockData, NewsLinkBlockInput> = {
    ...createBlockSkeleton(),

    name: "NewsLink",

    displayName: "News",

    defaultValues: () => ({}),

    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <Field name="id" label="ID" fullWidth component={FinalFormInput} />
            </BlocksFinalForm>
        );
    },

    previewContent: (state) => (state.id !== undefined ? [{ type: "text", content: state.id }] : []),
};

export { NewsLinkBlock };
