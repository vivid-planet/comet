import { gql, useApolloClient } from "@apollo/client";
import { Field, FieldContainer, FinalFormInput } from "@comet/admin";
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
import { FieldArray } from "react-final-form-arrays";
import { FormattedMessage } from "react-intl";

import { DamVideoBlockData, DamVideoBlockInput } from "../blocks.generated";
import { useContentScope } from "../contentScope/Provider";
import { useDependenciesConfig } from "../dependencies/DependenciesConfig";
import { DamPathLazy } from "../form/file/DamPathLazy";
import { FileField, GQLDamFileFieldFileFragment } from "../form/file/FileField";
import { FileUploadField } from "../form/file/FileUploadField";
import { CmsBlockContext } from "./CmsBlockContextProvider";
import { GQLVideoBlockDamFileQuery, GQLVideoBlockDamFileQueryVariables } from "./DamVideoBlock.generated";
import { damFileFieldFileQuery } from "../form/file/FileField.gql";
import {
    GQLDamFileFieldFileQuery,
    GQLDamFileFieldFileQueryVariables,
} from "../form/file/FileField.gql.generated";
import { VideoOptionsFields } from "./helpers/VideoOptionsFields";
import { PixelImageBlock } from "./PixelImageBlock";

type SubtitleState = { file?: GQLDamFileFieldFileFragment; language: string };
type State = Omit<DamVideoBlockData, "previewImage" | "subtitles"> & {
    previewImage: BlockState<typeof PixelImageBlock>;
    subtitles: SubtitleState[];
};

export const DamVideoBlock: BlockInterface<DamVideoBlockData, State, DamVideoBlockInput> = {
    ...createBlockSkeleton(),

    name: "DamVideo",

    displayName: <FormattedMessage id="comet.blocks.damVideo" defaultMessage="Video (CMS Asset)" />,

    defaultValues: () => ({ showControls: true, previewImage: PixelImageBlock.defaultValues(), subtitles: [] }),

    category: BlockCategory.Media,

    input2State: (input) => ({ ...input, previewImage: PixelImageBlock.input2State(input.previewImage), subtitles: input.subtitles ?? [] }),

    state2Output: (state) => ({
        damFileId: state.damFile?.id,
        previewImage: PixelImageBlock.state2Output(state.previewImage),
        autoplay: state.autoplay,
        loop: state.loop,
        showControls: state.showControls,
        subtitles: state.subtitles.map((s) => ({ fileId: s.file?.id, language: s.language })),
    }),

    output2State: async (output, context: CmsBlockContext) => {
        if (!output.damFileId) {
            return { previewImage: await PixelImageBlock.output2State(output.previewImage, context), subtitles: [] };
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

        const subtitles: SubtitleState[] = [];
        for (const sub of output.subtitles ?? []) {
            if (!sub.fileId) continue;
            const { data: subData } = await context.apolloClient.query<GQLDamFileFieldFileQuery, GQLDamFileFieldFileQueryVariables>({
                query: damFileFieldFileQuery,
                variables: { id: sub.fileId },
            });
            subtitles.push({ file: subData.damFile as GQLDamFileFieldFileFragment, language: sub.language });
        }

        return {
            damFile,
            autoplay: output.autoplay,
            loop: output.loop,
            showControls: output.showControls,
            previewImage: await PixelImageBlock.output2State(output.previewImage, context),
            subtitles,
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

        state.subtitles.forEach((s) => {
            if (s.file?.id) {
                dependencies.push({
                    targetGraphqlObjectType: "DamFile",
                    id: s.file.id,
                    data: { damFile: s.file },
                });
            }
        });

        return dependencies;
    },

    replaceDependenciesInOutput: (output, replacements) => {
        const clonedOutput: DamVideoBlockInput = deepClone(output);
        const replacement = replacements.find((replacement) => replacement.type === "DamFile" && replacement.originalId === output.damFileId);

        if (replacement) {
            clonedOutput.damFileId = replacement.replaceWithId;
        }

        clonedOutput.subtitles = clonedOutput.subtitles?.map((s) => {
            const rep = replacements.find((r) => r.type === "DamFile" && r.originalId === s.fileId);
            return rep ? { ...s, fileId: rep.replaceWithId } : s;
        });

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
                        <Field name="damFile" component={FileField} fullWidth allowedMimetypes={["video/mp4", "video/webm"]} />
                    )}
                    <VideoOptionsFields />
                    <AdminComponentSection title={<FormattedMessage id="comet.blocks.video.subtitles" defaultMessage="Subtitles" />}>
                        <FieldArray name="subtitles">
                            {({ fields }) => (
                                <>
                                    {fields.map((name, i) => (
                                        <Grid container spacing={2} key={name} alignItems="center" sx={{ mb: 2 }}>
                                            <Grid item xs={6}>
                                                <Field name={`${name}.file`} component={FileField} fullWidth allowedMimetypes={["text/vtt"]} />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Field name={`${name}.language`} component={FinalFormInput} placeholder="en" fullWidth />
                                            </Grid>
                                            <Grid item>
                                                <IconButton onClick={() => fields.remove(i)} size="large">
                                                    <Delete />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <AdminComponentButton variant="primary" onClick={() => fields.push({ file: undefined, language: "" })}>
                                        <FormattedMessage id="comet.blocks.video.addSubtitle" defaultMessage="Add subtitle" />
                                    </AdminComponentButton>
                                </>
                            )}
                        </FieldArray>
                    </AdminComponentSection>
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
