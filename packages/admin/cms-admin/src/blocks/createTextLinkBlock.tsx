import { Field, FinalFormInput, messages } from "@comet/admin";
import {
    AdminComponentPaper,
    BlockCategory,
    BlockInterface,
    BlocksFinalForm,
    BlockState,
    composeBlocks,
    createBlockSkeleton,
    decomposeUpdateStateAction,
    withAdditionalBlockAttributes,
} from "@comet/blocks-admin";
import { Box } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { TextLinkBlockData, TextLinkBlockInput } from "../blocks.generated";

interface CreateTextLinkBlockOptions {
    link: BlockInterface;
}

export function createTextLinkBlock({ link: LinkBlock }: CreateTextLinkBlockOptions): BlockInterface {
    const { api: composedApi, block: composedBlock } = composeBlocks({ link: LinkBlock });

    const block = withAdditionalBlockAttributes<Pick<TextLinkBlockData, "text">>({
        text: "",
    })(composedBlock);

    const TextLinkBlock: BlockInterface<TextLinkBlockData, BlockState<typeof block>, TextLinkBlockInput> = {
        ...createBlockSkeleton(),
        ...block,

        name: "TextLink",

        displayName: <FormattedMessage {...messages.link} />,

        category: BlockCategory.Navigation,

        definesOwnPadding: true,

        AdminComponent: ({ state, updateState }) => {
            const { link } = composedApi.adminComponents({ state, updateState: decomposeUpdateStateAction(updateState, ["link"]) });

            return (
                <AdminComponentPaper disablePadding>
                    <Box padding={3} paddingBottom={0}>
                        <BlocksFinalForm
                            onSubmit={({ text }) => {
                                updateState((prevState) => ({ ...prevState, text }));
                            }}
                            initialValues={{ text: state.text }}
                        >
                            <Field label={<FormattedMessage {...messages.text} />} name="text" component={FinalFormInput} fullWidth />
                        </BlocksFinalForm>
                    </Box>
                    {link}
                </AdminComponentPaper>
            );
        },

        previewContent: (state) => [{ type: "text", content: state.text }],

        dynamicDisplayName: (state) => LinkBlock.dynamicDisplayName?.(state.link),
    };

    return TextLinkBlock;
}
