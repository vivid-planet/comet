import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormInput,
    MainContent,
    SaveButton,
    SplitButton,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    ToolbarTitleItem,
    useStackApi,
} from "@comet/admin";
import { EditPageLayout } from "@comet/admin-cms";
import { ArrowLeft } from "@comet/admin-icons";
import { IconButton } from "@material-ui/core";
import { GQLMutationcreateNewsArgs, GQLMutationupdateNewsArgs, GQLNewsInput, GQLNewsQuery, GQLNewsQueryVariables } from "@src/graphql.generated";
import { FORM_ERROR } from "final-form";
import arrayMutators from "final-form-arrays";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const newsQuery = gql`
    query News($id: ID!) {
        news(newsId: $id) {
            id
            slug
            title
        }
    }
`;

interface NewsFormProps {
    newsId: string;
}

const isValidSlug = (value: string) => {
    return /^([a-zA-Z0-9-._~]|%[0-9a-fA-F]{2})+$/.test(value);
};

const NewsForm: React.FC<NewsFormProps> = ({ newsId }) => {
    const intl = useIntl();
    const stackApi = useStackApi();
    const client = useApolloClient();

    const { data } = useQuery<GQLNewsQuery, GQLNewsQueryVariables>(newsQuery, {
        variables: { id: newsId },
        skip: newsId === "new",
    });

    const handleSubmit = async (input: GQLNewsInput) => {
        if (data?.news) {
            return client.mutate<GQLMutationupdateNewsArgs>({
                mutation: updateNewsMutation,
                variables: { id: newsId, input },
            });
        } else {
            return client.mutate<GQLMutationcreateNewsArgs>({
                mutation: createNewsMutation,
                variables: { input },
            });
        }
    };
    return (
        <FinalForm<GQLNewsInput>
            onSubmit={handleSubmit}
            mode={newsId ? "edit" : "add"}
            initialValues={data?.news ? { title: data.news.title, slug: data.news.slug } : { title: "", slug: "" }}
            mutators={{ ...arrayMutators }}
            renderButtons={() => null}
            onAfterSubmit={(values, form) => {
                form.reset(values);
            }}
        >
            {({ values, pristine, hasValidationErrors, submitting, handleSubmit, hasSubmitErrors }) => (
                <EditPageLayout>
                    <Toolbar>
                        <ToolbarItem>
                            <IconButton onClick={stackApi?.goBack}>
                                <ArrowLeft />
                            </IconButton>
                        </ToolbarItem>
                        <ToolbarTitleItem>
                            {values.title ? values.title : <FormattedMessage id={"comet.news.newsDetail"} defaultMessage={"News Detail"} />}
                        </ToolbarTitleItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey={"editInspirationSave"}>
                                <SaveButton color={"primary"} variant={"contained"} hasErrors={hasSubmitErrors} type={"submit"}>
                                    <FormattedMessage id="comet.generic.save" defaultMessage="Save" />
                                </SaveButton>
                                <SaveButton
                                    color={"primary"}
                                    variant={"contained"}
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
                                    <FormattedMessage id="comet.generic.saveAndGoBack" defaultMessage="Save and go back" />
                                </SaveButton>
                            </SplitButton>
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <Field
                            type="text"
                            name="title"
                            fullWidth
                            label={intl.formatMessage({ id: "comet.generic.title", defaultMessage: "Title" })}
                            component={FinalFormInput}
                            required
                        />
                        <Field
                            type="text"
                            name="slug"
                            fullWidth
                            label={intl.formatMessage({ id: "comet.generic.slug", defaultMessage: "Slug" })}
                            component={FinalFormInput}
                            required
                            format={(value: string) => (value ? value.toLowerCase() : "")}
                            validate={async (value) => {
                                if (!isValidSlug(value)) {
                                    return intl.formatMessage({
                                        id: "comet.news.slugErrorMsg",
                                        defaultMessage: "Slug contains forbidden symbols",
                                    });
                                }
                            }}
                        />
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
};

export default NewsForm;

const updateNewsMutation = gql`
    mutation UpdateNews($id: ID!, $input: NewsInput!) {
        updateNews(newsId: $id, input: $input) {
            id
            slug
            title
        }
    }
`;

const createNewsMutation = gql`
    mutation CreateNews($input: NewsInput!) {
        createNews(input: $input) {
            id
            slug
            title
        }
    }
`;
