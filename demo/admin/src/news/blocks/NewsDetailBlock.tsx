import { Field, FinalFormInput } from "@comet/admin";
import { BlockInterface, BlocksFinalForm, createBlockSkeleton } from "@comet/blocks-admin";
import { NewsDetailBlockData, NewsDetailBlockInput } from "@src/blocks.generated";
import * as React from "react";

type State = NewsDetailBlockData;

const NewsDetailBlock: BlockInterface<NewsDetailBlockData, State, NewsDetailBlockInput> = {
    ...createBlockSkeleton(),

    name: "NewsDetail",

    displayName: "News Detail",

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

export { NewsDetailBlock };
