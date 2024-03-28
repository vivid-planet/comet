import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormInput,
    FinalFormSaveSplitButton,
    FinalFormSelect,
    FinalFormSubmitEvent,
    Loading,
    MainContent,
    messages,
    SubRoute,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    ToolbarTitleItem,
    useFormApiRef,
    useStackApi,
    useStackSwitchApi,
} from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { ArrowLeft } from "@comet/admin-icons";
import { AdminComponentRoot, AdminTabLabel, BlockState, createFinalFormBlock } from "@comet/blocks-admin";
import {
    BlockPreviewWithTabs,
    DamImageBlock,
    EditPageLayout,
    queryUpdatedAt,
    resolveHasSaveConflict,
    useBlockPreview,
    useCmsBlockContext,
    useFormSaveConflict,
    useSiteConfig,
} from "@comet/cms-admin";
import { IconButton, MenuItem } from "@mui/material";
import { useContentScope } from "@src/common/ContentScopeProvider";
import { FormApi } from "final-form";
import { filter } from "graphql-anywhere";
import isEqual from "lodash.isequal";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouteMatch } from "react-router";

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
    const siteConfig = useSiteConfig({ scope });
    const intl = useIntl();
    const previewApi = useBlockPreview();
    const match = useRouteMatch();
    const blockContext = useCmsBlockContext();

    const previewContext = {
        ...blockContext,
        parentUrl: match.url,
        showVisibleOnly: previewApi.showOnlyVisible,
    };

    const { data, error, loading, refetch } = useQuery<GQLNewsFormQuery, GQLNewsFormQueryVariables>(
        newsFormQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues = React.useMemo<Partial<FormValues>>(
        () =>
            data?.news
                ? {
                      ...filter<GQLNewsFormFragment>(newsFormFragment, data.news),
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
            {({ values, form }) => (
                <EditPageLayout>
                    {saveConflict.dialogs}
                    <Toolbar>
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
                            <FinalFormSaveSplitButton hasConflict={saveConflict.hasConflict} />
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <BlockPreviewWithTabs
                            previewUrl={`${siteConfig.blockPreviewBaseUrl}/news`}
                            previewState={{
                                ...values,
                                image: DamImageBlock.createPreviewState(values.image, previewContext),
                                content: NewsContentBlock.createPreviewState(values.content, {
                                    ...previewContext,
                                    parentUrl: `${match.url}/content`,
                                }),
                            }}
                            previewApi={previewApi}
                        >
                            {[
                                {
                                    key: "basic",
                                    label: (
                                        <AdminTabLabel
                                            isValid={() => {
                                                // TODO remove once tabs aren't unmounted anymore
                                                if (!form.getFieldState("slug")) {
                                                    return true;
                                                }

                                                // TODO is this a good idea?
                                                return (
                                                    (form.getFieldState("slug")?.valid &&
                                                        form.getFieldState("title")?.valid &&
                                                        form.getFieldState("status")?.valid &&
                                                        form.getFieldState("date")?.valid &&
                                                        form.getFieldState("category")?.valid &&
                                                        form.getFieldState("image")?.valid) ??
                                                    false
                                                );
                                            }}
                                        >
                                            <FormattedMessage id="news.tabs.basic.label" defaultMessage="Basic" />
                                        </AdminTabLabel>
                                    ),
                                    content: (
                                        <>
                                            <Field
                                                required
                                                fullWidth
                                                name="slug"
                                                component={FinalFormInput}
                                                label={<FormattedMessage id="news.slug" defaultMessage="Slug" />}
                                            />
                                            <Field
                                                required
                                                fullWidth
                                                name="title"
                                                component={FinalFormInput}
                                                label={<FormattedMessage id="news.title" defaultMessage="Title" />}
                                            />
                                            <Field fullWidth name="status" label={<FormattedMessage id="news.status" defaultMessage="Status" />}>
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
                                            <Field
                                                required
                                                fullWidth
                                                name="date"
                                                component={FinalFormDatePicker}
                                                label={<FormattedMessage id="news.date" defaultMessage="Date" />}
                                            />
                                            <Field
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
                                            <Field<BlockState<typeof rootBlocks.image>>
                                                name="image"
                                                isEqual={isEqual}
                                                label={<FormattedMessage id="news.image" defaultMessage="Image" />}
                                                fullWidth
                                                validate={async (value) => {
                                                    const isValid = await rootBlocks.image.isValid(value);
                                                    return isValid ? undefined : (
                                                        <FormattedMessage id="news.image.invalid" defaultMessage="Invalid image" />
                                                    );
                                                }}
                                            >
                                                {createFinalFormBlock(rootBlocks.image)}
                                            </Field>
                                        </>
                                    ),
                                },
                                {
                                    key: "content",
                                    label: (
                                        <AdminTabLabel
                                            isValid={() => {
                                                // TODO remove once tabs aren't unmounted anymore
                                                if (!form.getFieldState("content")) {
                                                    return true;
                                                }

                                                // TODO is this a good idea?
                                                return form.getFieldState("content")?.valid ?? false;
                                            }}
                                        >
                                            <FormattedMessage {...messages.content} />
                                        </AdminTabLabel>
                                    ),
                                    content: (
                                        <AdminComponentRoot title={intl.formatMessage(messages.content)}>
                                            {/* TODO Use RouterTabs inside BlockPreviewWithTabs */}
                                            <SubRoute path="">
                                                <Field<BlockState<typeof rootBlocks.content>>
                                                    name="content"
                                                    isEqual={isEqual}
                                                    fullWidth
                                                    validate={async (value) => {
                                                        const isValid = await rootBlocks.content.isValid(value);
                                                        return isValid ? undefined : (
                                                            <FormattedMessage id="news.content.invalid" defaultMessage="Invalid content" />
                                                        );
                                                    }}
                                                >
                                                    {createFinalFormBlock(rootBlocks.content)}
                                                </Field>
                                            </SubRoute>
                                        </AdminComponentRoot>
                                    ),
                                },
                            ]}
                        </BlockPreviewWithTabs>
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}
