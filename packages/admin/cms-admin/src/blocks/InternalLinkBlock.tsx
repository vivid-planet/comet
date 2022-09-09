import { gql } from "@apollo/client";
import { Field } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, LinkBlockInterface, SelectPreviewComponent } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { InternalLinkBlockData, InternalLinkBlockInput } from "../blocks.generated";
import { GQLLinkBlockTargetPageQuery, GQLLinkBlockTargetPageQueryVariables } from "../graphql.generated";
import FinalFormPageTreeSelect from "../pages/pageTreeSelect/FinalFormPageTreeSelect";
import { CmsBlockContext } from "./CmsBlockContextProvider";

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
                    }
                }
            `,
            variables: { id: output.targetPageId },
        });

        // TODO consider throwing an error
        return { targetPage: data.pageTreeNode ?? undefined };
    },

    isValid: () => {
        // TODO internal link validation
        return true;
    },

    definesOwnPadding: true,

    AdminComponent: ({ state, updateState }) => {
        return (
            <SelectPreviewComponent>
                <BlocksFinalForm
                    onSubmit={(newState) => {
                        updateState((prevState) => ({ ...prevState, ...newState }));
                    }}
                    initialValues={state}
                >
                    <Field name="targetPage" component={FinalFormPageTreeSelect} fullWidth />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },

    previewContent: (state) => (state.targetPage?.name ? [{ type: "text", content: state.targetPage.name }] : []),
};
