import { gql } from "@apollo/client";
<<<<<<< HEAD
import { Field, FinalFormSelect, messages } from "@comet/admin";
import { Delete } from "@comet/admin-icons";
import { Box, Divider, MenuItem, Typography } from "@mui/material";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { FormattedMessage } from "react-intl";

import { type DamFileDownloadLinkBlockData, type DamFileDownloadLinkBlockInput } from "../../blocks.generated";
import { BlockAdminComponentButton } from "../../blocks/common/BlockAdminComponentButton";
import { BlockAdminComponentPaper } from "../../blocks/common/BlockAdminComponentPaper";
import { BlocksFinalForm } from "../../blocks/form/BlocksFinalForm";
import { createBlockSkeleton } from "../../blocks/helpers/createBlockSkeleton";
import { BlockCategory, type BlockDependency, type BlockInterface } from "../../blocks/types";
import { DamPathLazy } from "../../form/file/DamPathLazy";
=======
import { Field, FinalFormSelect } from "@comet/admin";
import { AdminComponentPaper, BlockCategory, BlockDependency, BlockInterface, BlocksFinalForm, createBlockSkeleton } from "@comet/blocks-admin";
import { Divider, MenuItem } from "@mui/material";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { FormattedMessage } from "react-intl";

import { DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput } from "../../blocks.generated";
import { CmsBlockContext } from "../../blocks/CmsBlockContextProvider";
>>>>>>> main
import { FileField } from "../../form/file/FileField";
import { type GQLDamFileDownloadLinkFileQuery, type GQLDamFileDownloadLinkFileQueryVariables } from "./DamFileDownloadLinkBlock.generated";

export const DamFileDownloadLinkBlock: BlockInterface<DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput> = {
    ...createBlockSkeleton(),

    name: "DamFileDownloadLink",

    displayName: <FormattedMessage id="comet.blocks.damFileDownloadLink" defaultMessage="CMS Asset" />,

    previewContent: (state) => (state.file ? [{ type: "text", content: state.file?.name }] : []),

    category: BlockCategory.Media,

    defaultValues: () => ({
        openFileType: "Download",
    }),

    state2Output: (state) => ({
        fileId: state.file?.id ?? undefined,
        openFileType: state.openFileType,
    }),

    output2State: async (output, { apolloClient }): Promise<DamFileDownloadLinkBlockData> => {
        const ret: DamFileDownloadLinkBlockData = {
            openFileType: output.openFileType,
        };

        if (output.fileId === undefined) {
            return ret;
        }

        const { data } = await apolloClient.query<GQLDamFileDownloadLinkFileQuery, GQLDamFileDownloadLinkFileQueryVariables>({
            query: gql`
                query DamFileDownloadLinkFile($id: ID!) {
                    damFile(id: $id) {
                        id
                        name
                        fileUrl
                        size
                        mimetype
                    }
                }
            `,
            variables: { id: output.fileId },
        });

        const { damFile } = data;

        ret.file = {
            id: damFile.id,
            name: damFile.name,
            fileUrl: damFile.fileUrl,
            size: damFile.size,
            mimetype: damFile.mimetype,
        };

        return ret;
    },

    dependencies: (state) => {
        const dependencies: BlockDependency[] = [];

        if (state.file?.id) {
            dependencies.push({
                targetGraphqlObjectType: "DamFile",
                id: state.file.id,
                data: {
                    damFile: state.file,
                },
            });
        }

        return dependencies;
    },

    replaceDependenciesInOutput: (output, replacements) => {
        const clonedOutput: DamFileDownloadLinkBlockInput = deepClone(output);
        const replacement = replacements.find((replacement) => replacement.type === "DamFile" && replacement.originalId === output.fileId);

        if (replacement) {
            clonedOutput.fileId = replacement.replaceWithId;
        }

        return clonedOutput;
    },

    definesOwnPadding: true,

    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm<{
                openFileType: DamFileDownloadLinkBlockData["openFileType"];
                file?: DamFileDownloadLinkBlockData["file"];
            }>
                onSubmit={(newValues) => {
                    updateState({
                        file: newValues.file ?? undefined,
                        openFileType: newValues.openFileType,
                    });
                }}
                initialValues={{
                    file: state.file,
                    openFileType: state.openFileType ?? "Download",
                }}
            >
<<<<<<< HEAD
                {state.file === undefined ? (
                    <Field name="file" component={FileField} fullWidth />
                ) : (
                    <BlockAdminComponentPaper disablePadding>
                        <Box padding={3}>
                            <Typography variant="subtitle1">{state.file.name}</Typography>
                            <Typography variant="body1" color="textSecondary">
                                <DamPathLazy fileId={state.file.id} />
                            </Typography>
                        </Box>
                        <Divider />
                        <BlockAdminComponentButton startIcon={<Delete />} onClick={() => updateState({ ...state, file: undefined })}>
                            <FormattedMessage {...messages.empty} />
                        </BlockAdminComponentButton>
                    </BlockAdminComponentPaper>
                )}
=======
                <Field name="file" component={FileField} fullWidth />
>>>>>>> main
                <Divider />
                <BlockAdminComponentPaper>
                    <Field
                        name="openFileType"
                        fullWidth
                        label={<FormattedMessage id="comet.blocks.damFileDownloadLink.openFileType" defaultMessage="Open file" />}
                    >
                        {(props) => (
                            <FinalFormSelect {...props}>
                                <MenuItem value="Download">
                                    <FormattedMessage id="comet.blocks.damFileDownloadLink.openFileType.download" defaultMessage="as a download" />
                                </MenuItem>
                                <MenuItem value="NewTab">
                                    <FormattedMessage id="comet.blocks.damFileDownloadLink.openFileType.newTab" defaultMessage="in a new tab" />
                                </MenuItem>
                            </FinalFormSelect>
                        )}
                    </Field>
                </BlockAdminComponentPaper>
            </BlocksFinalForm>
        );
    },

    extractTextContents: (state) => {
        const contents = [];

        if (state.file?.altText) contents.push(state.file.altText);
        if (state.file?.title) contents.push(state.file.title);

        return contents;
    },
};
