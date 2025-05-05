import { gql, useApolloClient } from "@apollo/client";
import { Field } from "@comet/admin";
import { Delete, MoreVertical, OpenNewTab } from "@comet/admin-icons";
import { Box, Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { deepClone } from "@mui/x-data-grid/internals";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { type SvgImageBlockData, type SvgImageBlockInput } from "../blocks.generated";
import { useCometConfig } from "../config/CometConfigContext";
import { useContentScope } from "../contentScope/Provider";
import { useDamAcceptedMimeTypes } from "../dam/config/useDamAcceptedMimeTypes";
import { useDependenciesConfig } from "../dependencies/dependenciesConfig";
import { DamPathLazy } from "../form/file/DamPathLazy";
import { FileField } from "../form/file/FileField";
import { BlockAdminComponentButton } from "./common/BlockAdminComponentButton";
import { BlockAdminComponentPaper } from "./common/BlockAdminComponentPaper";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";
import { type GQLSvgImageBlockDamFileQuery, type GQLSvgImageBlockDamFileQueryVariables } from "./SvgImageBlock.generated";
import { BlockCategory, type BlockDependency, type BlockInterface } from "./types";

type SvgImageBlockState = Omit<SvgImageBlockData, "urlTemplate">;

function createPreviewUrl({ damFile }: SvgImageBlockState, apiUrl: string): string {
    if (!damFile) return "";
    return new URL(
        `${apiUrl}/dam/files/preview/$fileId/$fileName`
            .replace("$fileId", damFile.id)
            .replace("$fileName", damFile.name.substr(0, damFile.name.lastIndexOf("."))),
    ).toString();
}

export const SvgImageBlock: BlockInterface<SvgImageBlockData, SvgImageBlockState, SvgImageBlockInput> = {
    ...createBlockSkeleton(),

    name: "SVG",

    displayName: <FormattedMessage id="comet.blocks.svgImage" defaultMessage="SVG" />,

    defaultValues: () => ({}),

    category: BlockCategory.Media,

    createPreviewState: (state, previewContext) => ({
        ...state,
        urlTemplate: createPreviewUrl(state, previewContext.apiUrl),
        adminMeta: { route: previewContext.parentUrl },
    }),

    state2Output: (v) => {
        if (!v.damFile) {
            return {};
        }
        return {
            damFileId: v.damFile.id,
        };
    },

    output2State: async (output, { apolloClient }): Promise<SvgImageBlockState> => {
        if (!output.damFileId) {
            return {};
        }

        const { data } = await apolloClient.query<GQLSvgImageBlockDamFileQuery, GQLSvgImageBlockDamFileQueryVariables>({
            query: gql`
                query SvgImageBlockDamFile($id: ID!) {
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
        const damFile = data.damFile as unknown as SvgImageBlockData["damFile"];

        return { damFile };
    },

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
        const clonedOutput: SvgImageBlockInput = deepClone(output);
        const replacement = replacements.find((replacement) => replacement.type === "DamFile" && replacement.originalId === output.damFileId);

        if (replacement) {
            clonedOutput.damFileId = replacement.replaceWithId;
        }

        return clonedOutput;
    },

    definesOwnPadding: true,

    AdminComponent: ({ state, updateState }) => {
        const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
        const { apiUrl } = useCometConfig();
        const { filteredAcceptedMimeTypes } = useDamAcceptedMimeTypes();
        const contentScope = useContentScope();
        const apolloClient = useApolloClient();
        const { entityDependencyMap } = useDependenciesConfig();

        const previewUrl = createPreviewUrl(state, apiUrl);
        const showMenu = Boolean(entityDependencyMap["DamFile"]);

        const handleMenuClose = () => {
            setAnchorEl(null);
        };

        return (
            <SelectPreviewComponent>
                {state.damFile ? (
                    <BlockAdminComponentPaper disablePadding>
                        <Box padding={3}>
                            <Grid container alignItems="center" spacing={3}>
                                <Grid>{previewUrl && <img src={previewUrl} width="70" height="70" />}</Grid>
                                <Grid size="grow">
                                    <Typography variant="subtitle1">{state.damFile.name}</Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <DamPathLazy fileId={state.damFile.id} />
                                    </Typography>
                                </Grid>
                                {showMenu && (
                                    <Grid>
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
                        <BlockAdminComponentButton startIcon={<Delete />} onClick={() => updateState({ damFile: undefined })}>
                            <FormattedMessage id="comet.blocks.image.empty" defaultMessage="Empty" />
                        </BlockAdminComponentButton>
                        {showMenu && (
                            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                {entityDependencyMap["DamFile"] && state.damFile?.id && (
                                    <MenuItem
                                        onClick={async () => {
                                            // id is checked three lines above
                                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                            const path = await entityDependencyMap["DamFile"].resolvePath({ apolloClient, id: state.damFile!.id });
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
                    </BlockAdminComponentPaper>
                ) : (
                    <BlocksFinalForm<{ damFile?: SvgImageBlockState["damFile"] }>
                        onSubmit={(newValues) => {
                            updateState((prevState) => ({ ...prevState, damFile: newValues.damFile || undefined }));
                        }}
                        initialValues={{ damFile: state.damFile }}
                    >
                        <Field
                            name="damFile"
                            component={FileField}
                            fullWidth
                            buttonText={<FormattedMessage id="comet.blocks.image.chooseImage" defaultMessage="Choose image" />}
                            allowedMimetypes={filteredAcceptedMimeTypes.svgImage}
                        />
                    </BlocksFinalForm>
                )}
            </SelectPreviewComponent>
        );
    },
    previewContent: (state, context) => {
        if (!state.damFile || !state.damFile?.fileUrl || !context?.apiUrl) {
            return [];
        }
        return [
            { type: "image", content: { src: createPreviewUrl(state, context.apiUrl), width: 320, height: 320 } },
            { type: "text", content: state.damFile.name },
        ];
    },
    extractTextContents: (state) => {
        const contents = [];

        if (state.damFile?.altText) contents.push(state.damFile.altText);
        if (state.damFile?.title) contents.push(state.damFile.title);

        return contents;
    },
};
