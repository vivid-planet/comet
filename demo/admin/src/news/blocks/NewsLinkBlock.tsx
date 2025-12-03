import { TextField } from "@comet/admin";
import { FileData } from "@comet/admin-icons";
import { type BlockInterface, BlocksFinalForm, createBlockSkeleton, type LinkBlockInterface } from "@comet/cms-admin";
import { type NewsLinkBlockData, type NewsLinkBlockInput } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

type State = NewsLinkBlockData;

const NewsLinkBlock: BlockInterface<NewsLinkBlockData, State, NewsLinkBlockInput> & LinkBlockInterface<State> = {
    ...createBlockSkeleton(),

    name: "NewsLink",

    displayName: "News",

    defaultValues: () => ({}),

    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <TextField
                    name="id"
                    label={<FormattedMessage id="blocks.newsLink.id.label" defaultMessage="ID" />}
                    fullWidth
                    disableContentTranslation
                />
            </BlocksFinalForm>
        );
    },

    previewContent: (state) => [...(state.id !== undefined ? [{ type: "text" as const, content: state.id }] : [])],
    icon: (state) => <FileData color="primary" />,
};

export { NewsLinkBlock };
