import { TextField } from "@comet/admin";
import { FileData } from "@comet/admin-icons";
import { BlockInterface, BlocksFinalForm, createBlockSkeleton, LinkBlockInterface } from "@comet/blocks-admin";
import { NewsLinkBlockData, NewsLinkBlockInput } from "@src/blocks.generated";

type State = NewsLinkBlockData;

const NewsLinkBlock: BlockInterface<NewsLinkBlockData, State, NewsLinkBlockInput> & LinkBlockInterface<State> = {
    ...createBlockSkeleton(),

    name: "NewsLink",

    displayName: "News",

    defaultValues: () => ({}),

    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <TextField name="id" label="ID" fullWidth disableContentTranslation />
            </BlocksFinalForm>
        );
    },

    previewContent: (state) => [
        ...(state.id !== undefined ? [{ type: "text" as const, content: state.id }] : []),
        { type: "icon", content: <FileData /> },
    ],
};

export { NewsLinkBlock };
