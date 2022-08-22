import { gql, useMutation, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormSelect,
    MainContent,
    messages,
    SaveButton,
    SplitButton,
    Toolbar,
    ToolbarFillSpace,
    ToolbarItem,
    useStackApi,
} from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { EditPageLayout, PageName } from "@comet/cms-admin";
import { CircularProgress, IconButton, MenuItem } from "@mui/material";
import {
    GQLPredefinedPageQuery,
    GQLPredefinedPageQueryVariables,
    GQLUpdatePredefinedPageMutation,
    GQLUpdatePredefinedPageMutationVariables,
} from "@src/graphql.generated";
import { FORM_ERROR } from "final-form";
import * as React from "react";
import { FormattedMessage } from "react-intl";

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
    mutation UpdatePredefinedPage($pageId: ID!, $input: PredefinedPageInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID) {
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
        return <CircularProgress />;
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
                    <EditPageLayout>
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
                            <Field label={<FormattedMessage id="cometDemo.structuredContent.type" defaultMessage="Type" />} name="type" fullWidth>
                                {(props) => (
                                    <FinalFormSelect {...props}>
                                        {predefinedPageOptions.map((item, index) => (
                                            <MenuItem value={item.value} key={index}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </FinalFormSelect>
                                )}
                            </Field>
                        </MainContent>
                    </EditPageLayout>
                );
            }}
        </FinalForm>
    );
};

const predefinedPageOptions = [{ value: "News", name: <FormattedMessage id="cometDemo.structuredContent.news" defaultMessage="News" /> }];
