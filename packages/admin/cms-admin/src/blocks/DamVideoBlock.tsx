import { gql, useApolloClient } from "@apollo/client";
import { Field, FieldContainer } from "@comet/admin";
import { Delete, MoreVertical, OpenNewTab, Video } from "@comet/admin-icons";
import {
    AdminComponentButton,
    AdminComponentPaper,
    BlockCategory,
    BlockDependency,
    BlockInterface,
    BlocksFinalForm,
    createBlockSkeleton,
    createCompositeBlock,
    useAdminComponentPaper,
} from "@comet/blocks-admin";
import { Box, Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DamVideoBlockData, DamVideoBlockInput } from "../blocks.generated";
import { useContentScope } from "../contentScope/Provider";
import { DamImageBlock } from "../dam/blocks/DamImageBlock";
import { useDependenciesConfig } from "../dependencies/DependenciesConfig";
import { DamPathLazy } from "../form/file/DamPathLazy";
import { FileField } from "../form/file/FileField";
import { CmsBlockContext } from "./CmsBlockContextProvider";
import { GQLVideoBlockDamFileQuery, GQLVideoBlockDamFileQueryVariables } from "./DamVideoBlock.generated";
import { VideoOptionsFields } from "./VideoOptionsFields";

type State = Omit<DamVideoBlockData, "previewImage">;

const DamVideoBaseBlock: BlockInterface<Omit<DamVideoBlockData, "previewImage">, State, Omit<DamVideoBlockInput, "previewImage">> = {
    ...createBlockSkeleton(),

    name: "DamVideo",

    displayName: <FormattedMessage id="comet.blocks.damVideo" defaultMessage="Video (CMS Asset)" />,

    defaultValues: () => ({ showControls: true }),

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
        const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
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
                                <AdminComponentButton startIcon={<Delete />} onClick={() => updateState({ damFile: undefined })}>
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
                </BlocksFinalForm>
            </Box>
        );
    },

    previewContent: (state) => (state.damFile ? [{ type: "text", content: state.damFile.name }] : []),
};

// TODO: how can i add the previewImage block to block above without wrapping it in a composite block?
export const DamVideoBlock = createCompositeBlock(
    {
        name: "DamVideo",
        displayName: <FormattedMessage id="comet.blocks.damVideo" defaultMessage="Video (CMS Asset)" />,
        blocks: {
            video: {
                block: DamVideoBaseBlock,
            },
            previewImage: {
                block: DamImageBlock,
                title: <FormattedMessage id="comet.blocks.video.previewImage" defaultMessage="Preview Image" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Media;
        block.previewContent = (state) => (state.video.damFile ? [{ type: "text", content: state.video.damFile.name }] : []);
        return block;
    },
);
