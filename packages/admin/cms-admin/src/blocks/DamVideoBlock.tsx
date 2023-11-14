import { gql } from "@apollo/client";
import { Field, FieldContainer, FinalFormSwitch, messages } from "@comet/admin";
import { Delete, Video } from "@comet/admin-icons";
import {
    AdminComponentButton,
    AdminComponentPaper,
    BlockCategory,
    BlockDependency,
    BlockInterface,
    BlocksFinalForm,
    createBlockSkeleton,
    useAdminComponentPaper,
} from "@comet/blocks-admin";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DamVideoBlockData, DamVideoBlockInput } from "../blocks.generated";
import { DamPathLazy } from "../form/file/DamPathLazy";
import { FileField } from "../form/file/FileField";
import { CmsBlockContext } from "./CmsBlockContextProvider";
import { GQLVideoBlockDamFileQuery, GQLVideoBlockDamFileQueryVariables } from "./DamVideoBlock.generated";

type State = DamVideoBlockData;

export const DamVideoBlock: BlockInterface<DamVideoBlockData, State, DamVideoBlockInput> = {
    ...createBlockSkeleton(),

    name: "DamVideo",

    displayName: <FormattedMessage id="comet.blocks.damVideo" defaultMessage="Video (CMS Asset)" />,

    defaultValues: () => ({
        showControls: true,
    }),

    category: BlockCategory.Media,

    state2Output: (state) => ({
        damFileId: state.damFile?.id,
        autoplay: state.autoplay,
        loop: state.loop,
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
                        fileUrl
                    }
                }
            `,
            variables: { id: output.damFileId },
        });

        // TODO consider throwing an error
        // TODO fix typing: generated GraphQL files use null, we use undefined, e.g. title: string | null vs title?: string
        const damFile = data.damFile as unknown as DamVideoBlockData["damFile"];

        return { damFile, autoplay: output.autoplay, loop: output.loop, showControls: output.showControls };
    },

    createPreviewState: (state, previewContext) => ({
        ...state,
        autoplay: false,
        loop: false,
        adminMeta: { route: previewContext.parentUrl },
    }),

    dependencies: (state) => {
        const dependencies: BlockDependency[] = [];

        if (state.damFile?.id) {
            dependencies.push({
                targetGraphqlObjectType: "DamFile",
                id: state.damFile.id,
                data: {
                    damFile: state.damFile,
                },
            });
        }

        return dependencies;
    },

    replaceDependenciesInOutput: (output, replacements) => {
        const clonedOutput: DamVideoBlockInput = deepClone(output);
        const replacement = replacements.find((replacement) => replacement.type === "DamFile" && replacement.originalId === output.damFileId);

        if (replacement) {
            clonedOutput.damFileId = replacement.replaceWithId;
        }

        return clonedOutput;
    },

    definesOwnPadding: true,

    AdminComponent: ({ state, updateState }) => {
        const isInPaper = useAdminComponentPaper();

        return (
            <Box padding={isInPaper ? 3 : 0} pb={0}>
                <BlocksFinalForm
                    onSubmit={(values) => {
                        updateState((prevState) => {
                            // case: autoplay = false and showControls = false is not allowed
                            if (!values.autoplay && prevState.autoplay) {
                                return { ...prevState, ...values, showControls: true };
                            }
                            if (!values.showControls && prevState.showControls) {
                                return { ...prevState, ...values, autoplay: true };
                            }
                            return { ...prevState, ...values };
                        });
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
                                                <DamPathLazy fileId={state.damFile.id} />
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
                        name="loop"
                        label={<FormattedMessage id="comet.blocks.video.loop" defaultMessage="Loop" />}
                        component={FinalFormSwitch}
                    />
                    <Field
                        type="checkbox"
                        name="showControls"
                        label={<FormattedMessage id="comet.blocks.video.showControls" defaultMessage="Show controls" />}
                        component={FinalFormSwitch}
                    />
                </BlocksFinalForm>
            </Box>
        );
    },

    previewContent: (state) => (state.damFile ? [{ type: "text", content: state.damFile.name }] : []),
};
