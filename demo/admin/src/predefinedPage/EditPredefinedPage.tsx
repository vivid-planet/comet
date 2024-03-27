import { gql, useMutation, useQuery } from "@apollo/client";
import {
    FinalForm,
    Loading,
    MainContent,
    messages,
    SaveButton,
    SelectField,
    SplitButton,
    Toolbar,
    ToolbarFillSpace,
    ToolbarItem,
    useStackApi,
} from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { PageName } from "@comet/cms-admin";
import { IconButton, MenuItem } from "@mui/material";
import { FORM_ERROR } from "final-form";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLPredefinedPageQuery,
    GQLPredefinedPageQueryVariables,
    GQLUpdatePredefinedPageMutation,
    GQLUpdatePredefinedPageMutationVariables,
} from "./EditPredefinedPage.generated";

const getQuery = gql`
    query PredefinedPage($id: ID!) {
        page: pageTreeNode(id: $id) {
            id
            name
            slug
            parentId
            document {
                __typename
                ... on DocumentInterface {
                    id
                    updatedAt
                }
                ... on PredefinedPage {
                    id
                    type
                }
            }
        }
    }
`;

const updateMutation = gql`
    mutation UpdatePredefinedPage($pageId: ID!, $input: PredefinedPageInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID!) {
        savePredefinedPage(id: $pageId, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
            id
            type
        }
    }
`;

interface Props {
    id: string;
}

export const EditPredefinedPage: React.FC<Props> = ({ id }) => {
    const stackApi = useStackApi();

    const { data, loading } = useQuery<GQLPredefinedPageQuery, GQLPredefinedPageQueryVariables>(getQuery, {
        variables: { id },
    });

    const [mutation] = useMutation<GQLUpdatePredefinedPageMutation, GQLUpdatePredefinedPageMutationVariables>(updateMutation, {
        refetchQueries: ["PredefinedPage"],
    });

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <FinalForm
            mode="edit"
            initialValues={{ type: data?.page?.document?.__typename === "PredefinedPage" ? data.page.document.type : undefined }}
            onSubmit={() => {
                mutation({ variables: { pageId: id, input: { type: "News" }, attachedPageTreeNodeId: id } });
            }}
        >
            {({ pristine, hasValidationErrors, submitting, handleSubmit, hasSubmitErrors }) => {
                return (
                    <>
                        <Toolbar>
                            <ToolbarItem>
                                <IconButton onClick={stackApi?.goBack}>
                                    <ArrowLeft />
                                </IconButton>
                            </ToolbarItem>
                            <PageName pageId={id} />
                            <ToolbarFillSpace />
                            <ToolbarItem>
                                <SplitButton disabled={pristine || hasValidationErrors || submitting}>
                                    <SaveButton hasErrors={hasSubmitErrors} type="submit">
                                        <FormattedMessage {...messages.save} />
                                    </SaveButton>
                                    <SaveButton
                                        saving={submitting}
                                        hasErrors={hasSubmitErrors}
                                        onClick={async () => {
                                            const submitResult = await handleSubmit();
                                            const error = submitResult?.[FORM_ERROR];
                                            if (!error) {
                                                stackApi?.goBack();
                                            }
                                        }}
                                    >
                                        <FormattedMessage {...messages.saveAndGoBack} />
                                    </SaveButton>
                                </SplitButton>
                            </ToolbarItem>
                        </Toolbar>
                        <MainContent>
                            <SelectField label={<FormattedMessage id="structuredContent.type" defaultMessage="Type" />} name="type" fullWidth>
                                {predefinedPageOptions.map((item, index) => (
                                    <MenuItem value={item.value} key={index}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </SelectField>
                        </MainContent>
                    </>
                );
            }}
        </FinalForm>
    );
};

const predefinedPageOptions = [{ value: "News", name: <FormattedMessage id="structuredContent.news" defaultMessage="News" /> }];
