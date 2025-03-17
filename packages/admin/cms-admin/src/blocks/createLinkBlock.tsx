import { Field, FinalFormInput } from "@comet/admin";
import { Box } from "@mui/system";
import { FormattedMessage } from "react-intl";

import { type LinkBlockData } from "../blocks.generated";
import { useBlockAdminComponentPaper } from "./common/BlockAdminComponentPaper";
import { BlockAdminComponentSection } from "./common/BlockAdminComponentSection";
import { ExternalLinkBlock } from "./ExternalLinkBlock";
import { createOneOfBlock, type CreateOneOfBlockOptions } from "./factories/createOneOfBlock";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { InternalLinkBlock } from "./InternalLinkBlock";
import { type BlockInterface, type LinkBlockInterface } from "./types";

interface CreateLinkBlockOptions extends Omit<CreateOneOfBlockOptions<boolean>, "name" | "supportedBlocks"> {
    name?: string;
    supportedBlocks?: Record<string, BlockInterface & LinkBlockInterface>;
}

function createLinkBlock(
    {
        name = "Link",
        displayName = <FormattedMessage id="comet.blocks.link" defaultMessage="Link" />,
        supportedBlocks = { internal: InternalLinkBlock, external: ExternalLinkBlock },
        allowEmpty = false,
        ...oneOfBlockOptions
    }: CreateLinkBlockOptions,
    override?: (block: BlockInterface & LinkBlockInterface) => BlockInterface & LinkBlockInterface,
): BlockInterface & LinkBlockInterface {
    const OneOfBlock = createOneOfBlock(
        {
            name,
            displayName,
            supportedBlocks,
            allowEmpty,
            ...oneOfBlockOptions,
        },
        override,
    );

    return {
        ...OneOfBlock,
        defaultValues: () => ({ ...OneOfBlock.defaultValues(), title: undefined }),
        AdminComponent: ({ state, updateState }) => {
            const isInPaper = useBlockAdminComponentPaper();

            return (
                <>
                    <OneOfBlock.AdminComponent state={state} updateState={updateState} />
<<<<<<< HEAD
                    <Box padding={isInPaper ? 3 : 0} paddingTop={0}>
                        <BlockAdminComponentSection>
=======
                    <Box padding={isInPaper ? 3 : 0} paddingTop={isInPaper ? 0 : 3}>
                        <AdminComponentSection>
>>>>>>> main
                            <BlocksFinalForm<Pick<LinkBlockData, "title">>
                                onSubmit={({ title }) => {
                                    updateState({ ...state, title });
                                }}
                                initialValues={{ title: state.title }}
                            >
                                <Field
                                    name="title"
                                    component={FinalFormInput}
                                    label={<FormattedMessage id="comet.blocks.link.title" defaultMessage="Title" />}
                                    fullWidth
                                />
                            </BlocksFinalForm>
                        </BlockAdminComponentSection>
                    </Box>
                </>
            );
        },
        url2State: (url) => {
            for (const [type, block] of Object.entries(supportedBlocks)) {
                if (block.url2State?.(url)) {
                    return {
                        attachedBlocks: [{ type, props: block.url2State(url) }],
                        activeType: type,
                    };
                }
            }

            return false;
        },
    };
}

export { createLinkBlock };
