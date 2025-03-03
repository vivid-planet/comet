import { gql, useApolloClient } from "@apollo/client";
import { Field, FieldContainer } from "@comet/admin";
import { Delete, MoreVertical, OpenNewTab, Video } from "@comet/admin-icons";
import {
    AdminComponentButton,
    AdminComponentPaper,
    AdminComponentSection,
    BlockCategory,
    BlockDependency,
    BlockInterface,
    BlocksFinalForm,
    BlockState,
    createBlockSkeleton,
    resolveNewState,
    useAdminComponentPaper,
} from "@comet/blocks-admin";
import { Box, Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { DamVideoBlockData, DamVideoBlockInput } from "../blocks.generated";
import { useContentScope } from "../contentScope/Provider";
import { useDependenciesConfig } from "../dependencies/DependenciesConfig";
import { DamPathLazy } from "../form/file/DamPathLazy";
import { FileField } from "../form/file/FileField";
import { CmsBlockContext } from "./CmsBlockContextProvider";
import { GQLVideoBlockDamFileQuery, GQLVideoBlockDamFileQueryVariables } from "./DamVideoBlock.generated";
import { VideoOptionsFields } from "./helpers/VideoOptionsFields";
import { PixelImageBlock } from "./PixelImageBlock";

type State = Omit<DamVideoBlockData, "previewImage"> & { previewImage: BlockState<typeof PixelImageBlock> };

export const DamVideoBlock: BlockInterface<DamVideoBlockData, State, DamVideoBlockInput> = {
    ...createBlockSkeleton(),

    name: "DamVideo",

    displayName: <FormattedMessage id="comet.blocks.damVideo" defaultMessage="Video (CMS Asset)" />,

    defaultValues: () => ({ showControls: true, previewImage: PixelImageBlock.defaultValues() }),

    category: BlockCategory.Media,

    input2State: (input) => ({ ...input, previewImage: PixelImageBlock.input2State(input.previewImage) }),

    state2Output: (state) => ({
        damFileId: state.damFile?.id,
        previewImage: PixelImageBlock.state2Output(state.previewImage),
        autoplay: state.autoplay,
        loop: state.loop,
        showControls: state.showControls,
    }),

    output2State: async (output, context: CmsBlockContext) => {
        if (!output.damFileId) {
            return { previewImage: await PixelImageBlock.output2State(output.previewImage, context) };
        }

        const { data } = await context.apolloClient.query<GQLVideoBlockDamFileQuery, GQLVideoBlockDamFileQueryVariables>({
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

        return {
            damFile,
            autoplay: output.autoplay,
            loop: output.loop,
            showControls: output.showControls,
            previewImage: await PixelImageBlock.output2State(output.previewImage, context),
        };
    },

    createPreviewState: (state, previewContext) => ({
        ...state,
        autoplay: false,
        loop: false,
        previewImage: PixelImageBlock.createPreviewState(state.previewImage, previewContext),
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
        const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
        const isInPaper = useAdminComponentPaper();
        const contentScope = useContentScope();
        const apolloClient = useApolloClient();
        const dependencyMap = useDependenciesConfig();

        const showMenu = Boolean(dependencyMap["DamFile"]);

        const handleMenuClose = () => {
            setAnchorEl(null);
        };

        return (
            <Box padding={isInPaper ? 3 : 0} pb={0}>
                <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                    {state.damFile ? (
                        <FieldContainer fullWidth>
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
                                        {showMenu && (
                                            <Grid item>
                                                <IconButton
                                                    onMouseDown={(event) => event.stopPropagation()}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setAnchorEl(event.currentTarget);
                                                    }}
                                                    size="large"
                                                >
                                                    <MoreVertical />
                                                </IconButton>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                                <Divider />
                                <AdminComponentButton startIcon={<Delete />} onClick={() => updateState({ ...state, damFile: undefined })}>
                                    <FormattedMessage id="comet.blocks.image.empty" defaultMessage="Empty" />
                                </AdminComponentButton>
                                {showMenu && (
                                    <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                        {dependencyMap["DamFile"] && state.damFile?.id && (
                                            <MenuItem
                                                onClick={async () => {
                                                    // id is checked three lines above
                                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                                    const path = await dependencyMap["DamFile"].resolvePath({ apolloClient, id: state.damFile!.id });
                                                    const url = contentScope.match.url + path;
                                                    window.open(url, "_blank");
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <OpenNewTab />
                                                </ListItemIcon>
                                                <FormattedMessage id="comet.blocks.image.openInDam" defaultMessage="Open in DAM" />
                                            </MenuItem>
                                        )}
                                    </Menu>
                                )}
                            </AdminComponentPaper>
                        </FieldContainer>
                    ) : (
                        <Field name="damFile" component={FileField} fullWidth allowedMimetypes={["video/mp4"]} />
                    )}
                    <VideoOptionsFields />
                    <AdminComponentSection title={<FormattedMessage id="comet.blocks.video.previewImage" defaultMessage="Preview Image" />}>
                        <PixelImageBlock.AdminComponent
                            state={state.previewImage}
                            updateState={(setStateAction) => {
                                updateState({ ...state, previewImage: resolveNewState({ prevState: state.previewImage, setStateAction }) });
                            }}
                        />
                    </AdminComponentSection>
                </BlocksFinalForm>
            </Box>
        );
    },

    previewContent: (state) => (state.damFile ? [{ type: "text", content: state.damFile.name }] : []),

    extractTextContents: (state) => {
        const contents = [];

        if (state.damFile?.altText) contents.push(state.damFile.altText);
        if (state.damFile?.title) contents.push(state.damFile.title);

        return contents;
    },
};
