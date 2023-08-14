import { gql } from "@apollo/client";
import { Field, FinalFormInput } from "@comet/admin";
import { Delete } from "@comet/admin-icons";
import {
    AdminComponentButton,
    AdminComponentPaper,
    AdminComponentSection,
    BlockCategory,
    BlockInterface,
    BlocksFinalForm,
    createBlockSkeleton,
} from "@comet/blocks-admin";
import { Box, Divider, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput } from "../blocks.generated";
import { useDamAcceptedMimeTypes } from "../dam/config/useDamAcceptedMimeTypes";
import { FileField } from "../form/file/FileField";
import { CmsBlockContext } from "./CmsBlockContextProvider";
import { GQLDamFileDownloadLinkFileQuery, GQLDamFileDownloadLinkFileQueryVariables } from "./createDamFileDownloadLinkBlock.generated";

type DamFileDownloadLinkBlockOptions = {
    label?: React.ReactElement;
    required?: boolean;
};
export function createDamFileDownloadLinkBlock(options?: DamFileDownloadLinkBlockOptions) {
    const DamFileDownloadLinkBlock: BlockInterface<DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput> = {
        ...createBlockSkeleton(),

        name: "DamFileDownloadLink",

        displayName: <FormattedMessage id="blocks.damFileDownloadLink" defaultMessage="CMS Asset" />,

        previewContent: (state) => [{ type: "text", content: state.file?.name }],

        category: BlockCategory.Navigation,

        defaultValues: () => ({}),

        state2Output: (state) => ({
            fileId: state.file?.id ?? undefined,
            gtmElementType: state.tracking?.gtmElementType,
            gtmElementName: state.tracking?.gtmElementName,
        }),

        output2State: async (output, { apolloClient }: CmsBlockContext): Promise<DamFileDownloadLinkBlockData> => {
            const ret: DamFileDownloadLinkBlockData = {};

            if (output.gtmElementType || output.gtmElementName) {
                ret.tracking = {};
                if (output.gtmElementType) ret.tracking.gtmElementType = output.gtmElementType;
                if (output.gtmElementName) ret.tracking.gtmElementName = output.gtmElementName;
            }

            if (output.fileId === undefined) {
                return ret;
            }

            const { data } = await apolloClient.query<GQLDamFileDownloadLinkFileQuery, GQLDamFileDownloadLinkFileQueryVariables>({
                query: gql`
                    query DamFileDownloadLinkFile($id: ID!) {
                        damFile(id: $id) {
                            id
                            name
                            size
                            damPath
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
                size: damFile.size,
                damPath: damFile.damPath,
                fileUrl: damFile.fileUrl,
            };

            return ret;
        },

        definesOwnPadding: true,

        AdminComponent: ({ state, updateState }) => {
            const { filteredAcceptedMimeTypes } = useDamAcceptedMimeTypes();

            return (
                <>
                    <BlocksFinalForm<{
                        file?: DamFileDownloadLinkBlockData["file"];
                        tracking?: DamFileDownloadLinkBlockData["tracking"];
                    }>
                        onSubmit={(newValues) => {
                            updateState({ file: newValues.file ?? undefined, tracking: newValues.tracking });
                        }}
                        initialValues={{ file: state.file, tracking: state.tracking }}
                    >
                        {state.file !== undefined ? (
                            <AdminComponentPaper disablePadding>
                                <Box padding={3}>
                                    <Typography variant="subtitle1">{state.file.name}</Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {state.file.damPath}
                                    </Typography>
                                </Box>
                                <Divider />
                                <AdminComponentButton startIcon={<Delete />} onClick={() => updateState({ file: undefined })}>
                                    <FormattedMessage id="generic.empty" defaultMessage="Empty" />
                                </AdminComponentButton>
                            </AdminComponentPaper>
                        ) : (
                            <Field
                                name="file"
                                component={FileField}
                                required={options?.required}
                                fullWidth
                                label={options?.label}
                                allowedMimetypes={Object.values(filteredAcceptedMimeTypes).flat()}
                            />
                        )}

                        <Divider />
                        <AdminComponentPaper>
                            <AdminComponentSection
                                title={<FormattedMessage id="blocks.damFileDownloadLink.tracking" defaultMessage="Data-Attributes for Tracking" />}
                            >
                                <Field
                                    name="tracking.gtmElementType"
                                    component={FinalFormInput}
                                    fullWidth
                                    label={<FormattedMessage id="blocks.damFileDownloadLink.tracking.gtmElementType" defaultMessage="Element Type" />}
                                />
                                <Field
                                    name="tracking.gtmElementName"
                                    component={FinalFormInput}
                                    fullWidth
                                    label={<FormattedMessage id="blocks.damFileDownloadLink.tracking.gtmElementName" defaultMessage="Element Name" />}
                                />
                            </AdminComponentSection>
                        </AdminComponentPaper>
                    </BlocksFinalForm>
                    <Divider />
                </>
            );
        },

        isValid: (state) => {
            return !(options?.required && !state.file);
        },
    };
    return DamFileDownloadLinkBlock;
}
