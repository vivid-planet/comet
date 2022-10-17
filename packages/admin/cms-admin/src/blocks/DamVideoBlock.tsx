import { gql } from "@apollo/client";
import { Field, FieldContainer, FinalFormSwitch, messages } from "@comet/admin";
import { Delete, Video } from "@comet/admin-icons";
import { AdminComponentButton, AdminComponentPaper, BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton } from "@comet/blocks-admin";
import { Box, Divider, Grid, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DamVideoBlockData, DamVideoBlockInput } from "../blocks.generated";
import { FileField } from "../form/file/FileField";
import { GQLVideoBlockDamFileQuery, GQLVideoBlockDamFileQueryVariables } from "../graphql.generated";
import { CmsBlockContext } from "./CmsBlockContextProvider";

type State = DamVideoBlockData;

export const DamVideoBlock: BlockInterface<DamVideoBlockData, State, DamVideoBlockInput> = {
    ...createBlockSkeleton(),

    name: "DamVideo",

    displayName: <FormattedMessage id="comet.blocks.damVideo" defaultMessage="Video (CMS Asset)" />,

    defaultValues: () => ({}),

    category: BlockCategory.Media,

    state2Output: (state) => ({
        damFileId: state.damFile?.id,
        autoplay: state.autoplay,
        showControls: state.showControls,
    }),

    output2State: async (output, { apolloClient }: CmsBlockContext): Promise<State> => {
        if (!output.damFileId) {
            return {};
        }

        const { data } = await apolloClient.query<GQLVideoBlockDamFileQuery, GQLVideoBlockDamFileQueryVariables>({
            query: gql`
                query VideoBlockDamFile($id: ID!) {
                    damFile(id: $id) {
                        id
                        name
                        size
                        mimetype
                        contentHash
                        title
                        altText
                        archived
                        damPath
                        fileUrl
                    }
                }
            `,
            variables: { id: output.damFileId },
        });

        // TODO consider throwing an error
        // TODO fix typing: generated GraphQL files use null, we use undefined, e.g. title: string | null vs title?: string
        const damFile = data.damFile as unknown as DamVideoBlockData["damFile"];

        return { damFile, autoplay: output.autoplay, showControls: output.showControls };
    },

    createPreviewState: (state, previewContext) => ({
        ...state,
        autoplay: false,
        adminMeta: { route: previewContext.parentUrl },
    }),

    definesOwnPadding: true,

    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm
                onSubmit={(values) => {
                    updateState((prevState) => ({ ...prevState, ...values }));
                }}
                initialValues={state}
            >
                {state.damFile ? (
                    <FieldContainer label={<FormattedMessage {...messages.file} />} fullWidth>
                        <AdminComponentPaper disablePadding>
                            <Box padding={3}>
                                <Grid container alignItems="center" spacing={3}>
                                    <Grid item>
                                        {/* TODO show thumbnail of video */}
                                        <Video fontSize="large" color="primary" />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="subtitle1">{state.damFile.name}</Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            {state.damFile.damPath}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Divider />
                            <AdminComponentButton startIcon={<Delete />} onClick={() => updateState({ damFile: undefined })}>
                                <FormattedMessage id="comet.blocks.image.empty" defaultMessage="Empty" />
                            </AdminComponentButton>
                        </AdminComponentPaper>
                    </FieldContainer>
                ) : (
                    <Field
                        name="damFile"
                        label={<FormattedMessage {...messages.file} />}
                        component={FileField}
                        fullWidth
                        allowedMimetypes={["video/mp4"]}
                    />
                )}
                <Field
                    type="checkbox"
                    name="autoplay"
                    label={<FormattedMessage id="comet.blocks.video.autoplay" defaultMessage="Autoplay" />}
                    component={FinalFormSwitch}
                />
                <Field
                    type="checkbox"
                    name="showControls"
                    label={<FormattedMessage id="comet.blocks.video.showControls" defaultMessage="Show controls" />}
                    component={FinalFormSwitch}
                />
            </BlocksFinalForm>
        );
    },

    previewContent: (state) => (state.damFile ? [{ type: "text", content: state.damFile.name }] : []),
};
