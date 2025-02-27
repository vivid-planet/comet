import { gql } from "@apollo/client";
import { Field, FinalFormSelect } from "@comet/admin";
import { Box, Divider, MenuItem } from "@mui/material";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { FormattedMessage } from "react-intl";

import { type InternalLinkBlockData, type InternalLinkBlockInput } from "../blocks.generated";
import FinalFormPageTreeSelect from "../pages/pageTreeSelect/FinalFormPageTreeSelect";
import { usePageTreeNodeDocumentAnchors } from "../pages/usePageTreeDocumentAnchors";
import { type CmsBlockContext } from "./CmsBlockContextProvider";
import { BlockAdminComponentPaper } from "./common/BlockAdminComponentPaper";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";
import { type GQLLinkBlockTargetPageQuery, type GQLLinkBlockTargetPageQueryVariables } from "./InternalLinkBlock.generated";
import { BlockCategory, type BlockDependency, type BlockInterface, type LinkBlockInterface } from "./types";

type State = InternalLinkBlockData;

export const InternalLinkBlock: BlockInterface<InternalLinkBlockData, State, InternalLinkBlockInput> & LinkBlockInterface<State> = {
    ...createBlockSkeleton(),

    name: "InternalLink",

    displayName: <FormattedMessage id="comet.blocks.internalLink" defaultMessage="Page Tree" />,

    defaultValues: () => ({ targetPage: undefined }),

    category: BlockCategory.Navigation,

    input2State: (state) => {
        return state;
    },

    state2Output: (state) => {
        return {
            targetPageId: state.targetPage?.id,
            targetPageAnchor: state.targetPageAnchor,
        };
    },

    output2State: async (output, { apolloClient }: CmsBlockContext) => {
        if (output.targetPageId === undefined) {
            return {};
        }

        const { data } = await apolloClient.query<GQLLinkBlockTargetPageQuery, GQLLinkBlockTargetPageQueryVariables>({
            query: gql`
                query LinkBlockTargetPage($id: ID!) {
                    pageTreeNode(id: $id) {
                        id
                        name
                        path
                        documentType
                    }
                }
            `,
            variables: { id: output.targetPageId },
        });

        // TODO consider throwing an error
        return { targetPage: data.pageTreeNode ?? undefined, targetPageAnchor: output.targetPageAnchor };
    },

    isValid: () => {
        // TODO internal link validation
        return true;
    },

    dependencies: (state) => {
        const dependencies: BlockDependency[] = [];

        if (state.targetPage?.id) {
            dependencies.push({
                targetGraphqlObjectType: "PageTreeNode",
                id: state.targetPage.id,
            });
        }

        return dependencies;
    },

    replaceDependenciesInOutput: (output, replacements) => {
        const clonedOutput: InternalLinkBlockInput = deepClone(output);
        const replacement = replacements.find((replacement) => replacement.type === "PageTreeNode" && replacement.originalId === output.targetPageId);

        if (replacement) {
            clonedOutput.targetPageId = replacement.replaceWithId;
        }

        return clonedOutput;
    },

    definesOwnPadding: true,

    AdminComponent: ({ state, updateState }) => {
        const anchors = usePageTreeNodeDocumentAnchors(state.targetPage);
        const anchorsLoading = anchors === undefined;

        return (
            <SelectPreviewComponent>
                <BlockAdminComponentPaper disablePadding>
                    <BlocksFinalForm
                        onSubmit={(newState) => {
                            updateState((previousState) => {
                                if (newState.targetPage == null) {
                                    return {
                                        targetPage: undefined,
                                        targetPageAnchor: undefined,
                                    };
                                } else if (newState.targetPage.id !== previousState.targetPage?.id) {
                                    return {
                                        targetPage: newState.targetPage,
                                        targetPageAnchor: undefined,
                                    };
                                } else {
                                    return {
                                        targetPage: newState.targetPage,
                                        targetPageAnchor:
                                            newState.targetPageAnchor === "none" || newState.targetPageAnchor === ""
                                                ? undefined
                                                : newState.targetPageAnchor,
                                    };
                                }
                            });
                        }}
                        initialValues={{
                            targetPage: state.targetPage,
                            targetPageAnchor: anchorsLoading ? "" : (state.targetPageAnchor ?? "none"),
                        }}
                    >
                        <Field name="targetPage" component={FinalFormPageTreeSelect} fullWidth fieldContainerProps={{ fieldMargin: "never" }} />
                        <Divider />
                        <Box padding={3}>
                            <Field
                                name="targetPageAnchor"
                                label={<FormattedMessage id="comet.blocks.internalLink.anchor.label" defaultMessage="Anchor" />}
                                fullWidth
                                disabled={state.targetPage == null || anchorsLoading}
                            >
                                {(props) => (
                                    <FinalFormSelect {...props} disabled={state.targetPage == null || anchorsLoading}>
                                        <MenuItem value="none">
                                            <FormattedMessage id="comet.blocks.internalLink.anchor.none" defaultMessage="None" />
                                        </MenuItem>
                                        {anchors?.map((anchor) => (
                                            <MenuItem key={anchor} value={anchor}>
                                                {anchor}
                                            </MenuItem>
                                        ))}
                                    </FinalFormSelect>
                                )}
                            </Field>
                        </Box>
                    </BlocksFinalForm>
                </BlockAdminComponentPaper>
            </SelectPreviewComponent>
        );
    },

    previewContent: (state) => {
        if (state.targetPage == null) {
            return [];
        }

        return [
            {
                type: "text",
                content: state.targetPageAnchor === undefined ? state.targetPage.name : `${state.targetPage.name}#${state.targetPageAnchor}`,
            },
        ];
    },

    extractTextContents: (state) => {
        return state.targetPage?.name ? [state.targetPage.name] : [];
    },
};
