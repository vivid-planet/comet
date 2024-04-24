import { gql } from "@apollo/client";
import { Field, FinalFormSelect, messages } from "@comet/admin";
import { Delete } from "@comet/admin-icons";
import { AdminComponentButton, AdminComponentPaper, BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton } from "@comet/blocks-admin";
import { Box, Divider, MenuItem, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput } from "../../blocks.generated";
import { CmsBlockContext } from "../../blocks/CmsBlockContextProvider";
import { DamPathLazy } from "../../form/file/DamPathLazy";
import { FileField } from "../../form/file/FileField";
import { GQLDamFileDownloadLinkFileQuery, GQLDamFileDownloadLinkFileQueryVariables } from "./DamFileDownloadLinkBlock.generated";

export const DamFileDownloadLinkBlock: BlockInterface<DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput> = {
    ...createBlockSkeleton(),

    name: "DamFileDownloadLink",

    displayName: <FormattedMessage id="blocks.damFileDownloadLink" defaultMessage="CMS Asset" />,

    previewContent: (state) => (state.file ? [{ type: "text", content: state.file?.name }] : []),

    category: BlockCategory.Media,

    defaultValues: () => ({
        openFileType: "Download",
    }),

    state2Output: (state) => ({
        fileId: state.file?.id ?? undefined,
        openFileType: state.openFileType,
    }),

    output2State: async (output, { apolloClient }: CmsBlockContext): Promise<DamFileDownloadLinkBlockData> => {
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
        };

        return ret;
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
                {state.file === undefined ? (
                    <Field name="file" component={FileField} fullWidth />
                ) : (
                    <AdminComponentPaper disablePadding>
                        <Box padding={3}>
                            <Typography variant="subtitle1">{state.file.name}</Typography>
                            <Typography variant="body1" color="textSecondary">
                                <DamPathLazy fileId={state.file.id} />
                            </Typography>
                        </Box>
                        <Divider />
                        <AdminComponentButton startIcon={<Delete />} onClick={() => updateState({ ...state, file: undefined })}>
                            <FormattedMessage {...messages.empty} />
                        </AdminComponentButton>
                    </AdminComponentPaper>
                )}
                <Divider />
                <AdminComponentPaper>
                    <Field
                        name="openFileType"
                        fullWidth
                        label={<FormattedMessage id="blocks.damFileDownloadLink.openFileType" defaultMessage="Open file" />}
                    >
                        {(props) => (
                            <>
                                <FinalFormSelect {...props}>
                                    <MenuItem value="Download">
                                        <FormattedMessage id="blocks.damFileDownloadLink.openFileType.download" defaultMessage="as a download" />
                                    </MenuItem>
                                    <MenuItem value="NewTab">
                                        <FormattedMessage id="blocks.damFileDownloadLink.openFileType.newTab" defaultMessage="in a new tab" />
                                    </MenuItem>
                                </FinalFormSelect>
                            </>
                        )}
                    </Field>
                </AdminComponentPaper>
            </BlocksFinalForm>
        );
    },

    isValid: (state) => {
        return !!state.file;
    },
};
