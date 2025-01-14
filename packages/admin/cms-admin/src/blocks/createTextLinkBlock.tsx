import { Field, FinalFormInput, messages } from "@comet/admin";
import { Box } from "@mui/material";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { TextLinkBlockData, TextLinkBlockInput } from "../blocks.generated";
import { AdminComponentPaper } from "./common/AdminComponentPaper";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { composeBlocks } from "./helpers/composeBlocks/composeBlocks";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import decomposeUpdateStateAction from "./helpers/decomposeUpdateStateAction";
import { withAdditionalBlockAttributes } from "./helpers/withAdditionalBlockAttributes";
import { BlockCategory, BlockInterface, BlockState } from "./types";

interface CreateTextLinkBlockOptions {
    name?: string;
    displayName?: ReactNode;
    link: BlockInterface;
}

export function createTextLinkBlock({
    link: LinkBlock,
    name = "TextLink",
    displayName = <FormattedMessage {...messages.link} />,
}: CreateTextLinkBlockOptions): BlockInterface {
    const { api: composedApi, block: composedBlock } = composeBlocks({ link: LinkBlock });

    const block = withAdditionalBlockAttributes<Pick<TextLinkBlockData, "text">>({
        text: "",
    })(composedBlock);

    const TextLinkBlock: BlockInterface<TextLinkBlockData, BlockState<typeof block>, TextLinkBlockInput> = {
        ...createBlockSkeleton(),
        ...block,

        name,

        displayName,

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
