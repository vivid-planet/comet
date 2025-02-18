import { Field, FinalFormInput } from "@comet/admin";
import { type BlockInterface, BlocksFinalForm, createBlockSkeleton } from "@comet/cms-admin";
import { type NewsDetailBlockData, type NewsDetailBlockInput } from "@src/blocks.generated";

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
