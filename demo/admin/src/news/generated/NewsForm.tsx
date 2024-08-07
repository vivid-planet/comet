// This file has been generated by comet admin-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.

import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    filterByFragment,
    FinalForm,
    FinalFormSaveButton,
    FinalFormSelect,
    FinalFormSubmitEvent,
    Loading,
    MainContent,
    TextField,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    ToolbarTitleItem,
    useFormApiRef,
    useStackApi,
    useStackSwitchApi,
} from "@comet/admin";
import { DateField } from "@comet/admin-date-time";
import { ArrowLeft } from "@comet/admin-icons";
import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
import { ContentScopeIndicator, DamImageBlock, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { IconButton, MenuItem } from "@mui/material";
import { useContentScope } from "@src/common/ContentScopeProvider";
import { FormApi } from "final-form";
import isEqual from "lodash.isequal";
import React from "react";
import { FormattedMessage } from "react-intl";

import { NewsContentBlock } from "../blocks/NewsContentBlock";
import { createNewsMutation, newsFormFragment, newsFormQuery, updateNewsMutation } from "./NewsForm.gql";
import {
    GQLCreateNewsMutation,
    GQLCreateNewsMutationVariables,
    GQLNewsFormFragment,
    GQLNewsFormQuery,
    GQLNewsFormQueryVariables,
    GQLUpdateNewsMutation,
    GQLUpdateNewsMutationVariables,
} from "./NewsForm.gql.generated";

const rootBlocks = {
    image: DamImageBlock,
    content: NewsContentBlock,
};

type FormValues = GQLNewsFormFragment & {
    image: BlockState<typeof rootBlocks.image>;
    content: BlockState<typeof rootBlocks.content>;
};

interface FormProps {
    id?: string;
}

export function NewsForm({ id }: FormProps): React.ReactElement {
    const stackApi = useStackApi();
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();
    const { scope } = useContentScope();

    const { data, error, loading, refetch } = useQuery<GQLNewsFormQuery, GQLNewsFormQueryVariables>(
        newsFormQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues = React.useMemo<Partial<FormValues>>(
        () =>
            data?.news
                ? {
                      ...filterByFragment<GQLNewsFormFragment>(newsFormFragment, data.news),

                      image: rootBlocks.image.input2State(data.news.image),
                      content: rootBlocks.content.input2State(data.news.content),
                  }
                : {
                      image: rootBlocks.image.defaultValues(),
                      content: rootBlocks.content.defaultValues(),
                  },
        [data],
    );

    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            const updatedAt = await queryUpdatedAt(client, "news", id);
            return resolveHasSaveConflict(data?.news.updatedAt, updatedAt);
        },
        formApiRef,
        loadLatestVersion: async () => {
            await refetch();
        },
    });

    const handleSubmit = async (state: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
        if (await saveConflict.checkForConflicts()) {
            throw new Error("Conflicts detected");
        }

        const output = {
            ...state,

            image: rootBlocks.image.state2Output(state.image),
            content: rootBlocks.content.state2Output(state.content),
        };

        if (mode === "edit") {
            if (!id) {
                throw new Error("Missing id in edit mode");
            }
            await client.mutate<GQLUpdateNewsMutation, GQLUpdateNewsMutationVariables>({
                mutation: updateNewsMutation,
                variables: { id, input: output },
            });
        } else {
            const { data: mutationResponse } = await client.mutate<GQLCreateNewsMutation, GQLCreateNewsMutationVariables>({
                mutation: createNewsMutation,
                variables: { scope, input: output },
            });
            if (!event.navigatingBack) {
                const id = mutationResponse?.createNews.id;
                if (id) {
                    setTimeout(() => {
                        stackSwitchApi.activatePage("edit", id);
                    });
                }
            }
        }
    };

    if (error) throw error;

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <FinalForm<FormValues> apiRef={formApiRef} onSubmit={handleSubmit} mode={mode} initialValues={initialValues}>
            {({ values }) => (
                <>
                    {saveConflict.dialogs}
                    <Toolbar scopeIndicator={<ContentScopeIndicator />}>
                        <ToolbarItem>
                            <IconButton onClick={stackApi?.goBack}>
                                <ArrowLeft />
                            </IconButton>
                        </ToolbarItem>
                        <ToolbarTitleItem>
                            <FormattedMessage id="news.News" defaultMessage="News" />
                        </ToolbarTitleItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <FinalFormSaveButton hasConflict={saveConflict.hasConflict} />
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <TextField
                            required
                            variant="horizontal"
                            fullWidth
                            name="slug"
                            label={<FormattedMessage id="news.slug" defaultMessage="Slug" />}
                        />
                        <TextField
                            required
                            variant="horizontal"
                            fullWidth
                            name="title"
                            label={<FormattedMessage id="news.title" defaultMessage="Title" />}
                        />
                        <Field variant="horizontal" fullWidth name="status" label={<FormattedMessage id="news.status" defaultMessage="Status" />}>
                            {(props) => (
                                <FinalFormSelect {...props}>
                                    <MenuItem value="Active">
                                        <FormattedMessage id="news.status.active" defaultMessage="Active" />
                                    </MenuItem>
                                    <MenuItem value="Deleted">
                                        <FormattedMessage id="news.status.deleted" defaultMessage="Deleted" />
                                    </MenuItem>
                                </FinalFormSelect>
                            )}
                        </Field>
                        <DateField
                            required
                            variant="horizontal"
                            fullWidth
                            name="date"
                            label={<FormattedMessage id="news.date" defaultMessage="Date" />}
                        />
                        <Field
                            variant="horizontal"
                            fullWidth
                            name="category"
                            label={<FormattedMessage id="news.category" defaultMessage="Category" />}
                        >
                            {(props) => (
                                <FinalFormSelect {...props}>
                                    <MenuItem value="Events">
                                        <FormattedMessage id="news.category.events" defaultMessage="Events" />
                                    </MenuItem>
                                    <MenuItem value="Company">
                                        <FormattedMessage id="news.category.company" defaultMessage="Company" />
                                    </MenuItem>
                                    <MenuItem value="Awards">
                                        <FormattedMessage id="news.category.awards" defaultMessage="Awards" />
                                    </MenuItem>
                                </FinalFormSelect>
                            )}
                        </Field>
                        <Field name="image" isEqual={isEqual}>
                            {createFinalFormBlock(rootBlocks.image)}
                        </Field>
                        <Field name="content" isEqual={isEqual}>
                            {createFinalFormBlock(rootBlocks.content)}
                        </Field>
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
}
