import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormInput,
    FinalFormSelect,
    Loading,
    MainContent,
    messages,
    SaveButton,
    SplitButton,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarTitleItem,
    useStackApi,
} from "@comet/admin";
import { useStackSwitchApi } from "@comet/admin/lib/stack/Switch";
import { BlockInterface, BlockState, createFinalFormBlock, isValidUrl } from "@comet/blocks-admin";
import { Card, CardContent, Grid, MenuItem } from "@mui/material";
import { FORM_ERROR } from "final-form";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    GQLCreateRedirectMutation,
    GQLRedirectDetailFragment,
    GQLRedirectDetailQuery,
    GQLRedirectDetailQueryVariables,
    GQLRedirectSourceAvailableQuery,
    GQLRedirectSourceAvailableQueryVariables,
    GQLRedirectSourceTypeValues,
} from "../graphql.generated";
import { redirectDetailQuery } from "./RedirectForm.gql";
import { useSubmitMutation } from "./submitMutation";

interface Props {
    id?: string;
    mode: "edit" | "add";
    linkBlock: BlockInterface;
    scope: Record<string, unknown>;
}

export interface FormValues {
    sourceType: GQLRedirectSourceTypeValues;
    source: string;
    target: BlockState<BlockInterface>;
    comment?: string;
    updatedAt?: string;
}

const useInitialValues = (id: string | undefined, linkBlock: BlockInterface): FormValues | undefined => {
    const { data } = useQuery<GQLRedirectDetailQuery, GQLRedirectDetailQueryVariables>(redirectDetailQuery, {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        variables: { id: id! },
        skip: !id,
    });

    if (id === undefined) {
        return {
            sourceType: "path",
            source: "",
            target: linkBlock.defaultValues(),
        };
    }

    if (!data) {
        return undefined;
    }

    const { redirect } = data;

    return {
        sourceType: redirect.sourceType,
        source: redirect.source,
        target: linkBlock.input2State(redirect.target),
        comment: redirect.comment ?? undefined,
        updatedAt: redirect.updatedAt,
    };
};

export const RedirectForm = ({ mode, id, linkBlock, scope }: Props): JSX.Element => {
    const intl = useIntl();
    const initialValues = useInitialValues(id, linkBlock);
    const targetInput = React.useMemo(() => createFinalFormBlock(linkBlock), [linkBlock]);
    const client = useApolloClient();

    const sourceTypeOptions = [
        {
            value: "path",
            label: intl.formatMessage({
                id: "comet.pages.redirects.redirect.source.type.path",
                defaultMessage: "Path",
            }),
        },
    ];

    const stackApi = useStackApi();
    const stackSwitchApi = useStackSwitchApi();

    const [submit, { loading: saving, error: saveError }] = useSubmitMutation(mode, id, linkBlock, scope);
    const newlyCreatedRedirectId = React.useRef<string>();

    if (mode === "edit" && initialValues === undefined) {
        return <Loading behavior="fillPageHeight" />;
    }

    const validateSource = async (value: string, allValues: GQLRedirectDetailFragment) => {
        if (allValues.sourceType === "path") {
            if (!value.startsWith("/")) {
                return <FormattedMessage id="comet.pages.redirects.validate.path.error" defaultMessage="Needs to start with /" />;
            } else if (value.includes("?")) {
                return <FormattedMessage id="comet.pages.redirects.validate.path.queryStringError" defaultMessage="Must not contain ?" />;
            } else if (!/^\/([a-zA-Z0-9-._~/]|%[0-9a-fA-F]{2})+$/.test(value)) {
                return <FormattedMessage id="comet.pages.redirects.validate.path.invalidPathError" defaultMessage="Invalid path" />;
            }

            const { data } = await client.query<GQLRedirectSourceAvailableQuery, GQLRedirectSourceAvailableQueryVariables>({
                query: gql`
                    query RedirectSourceAvailable($scope: RedirectScopeInput!, $source: String!) {
                        redirectSourceAvailable(scope: $scope, source: $source)
                    }
                `,
                variables: {
                    scope,
                    source: value,
                },
                fetchPolicy: "network-only",
            });

            if (!data.redirectSourceAvailable && initialValues?.source !== undefined && initialValues.source !== value) {
                return (
                    <FormattedMessage
                        id="comet.redirects.form.validation.sourceTaken"
                        defaultMessage="Source {source} is not available"
                        values={{ source: value }}
                    />
                );
            }
        } else {
            return validateDomain(value);
        }
    };

    const validateDomain = (value: string) => {
        if (!isValidUrl(value)) {
            return intl.formatMessage({
                id: "comet.pages.redirects.validate.domain.error",
                defaultMessage: "Needs to start with http:// or https://",
            });
        }
    };

    const handleSaveClick = async (values: FormValues) => {
        const response = await submit(values);

        if (response.data && "createRedirect" in response.data) {
            newlyCreatedRedirectId.current = (response.data as GQLCreateRedirectMutation).createRedirect.id;
        }
    };

    return (
        <FinalForm
            mode={mode}
            onSubmit={handleSaveClick}
            initialValues={initialValues}
            renderButtons={() => null}
            onAfterSubmit={(values, form) => {
                form.reset(values);
            }}
            initialValuesEqual={isEqual}
        >
            {({ values, pristine, hasValidationErrors, submitting, handleSubmit, validating }) => (
                <>
                    <Toolbar>
                        <ToolbarBackButton />
                        <ToolbarTitleItem>
                            {values.source ? values.source : <FormattedMessage id="comet.redirects.defaultTitle" defaultMessage="Redirect Detail" />}
                        </ToolbarTitleItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <SplitButton disabled={pristine || hasValidationErrors || submitting || validating} localStorageKey="editRedirectSave">
                                <SaveButton
                                    color="primary"
                                    variant="contained"
                                    saving={saving}
                                    hasErrors={saveError != null}
                                    type="submit"
                                    onClick={async () => {
                                        const submitResult = await handleSubmit();
                                        const error = submitResult?.[FORM_ERROR];
                                        if (!error && mode === "add" && newlyCreatedRedirectId.current) {
                                            stackSwitchApi.activatePage("edit", newlyCreatedRedirectId.current);
                                        }
                                    }}
                                >
                                    <FormattedMessage {...messages.save} />
                                </SaveButton>

                                <SaveButton
                                    color="primary"
                                    variant="contained"
                                    saving={saving}
                                    hasErrors={saveError != null}
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
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <Card>
                            <CardContent>
                                <Grid container spacing={4}>
                                    <Grid item xs={3}>
                                        <Field
                                            label={intl.formatMessage({
                                                id: "comet.pages.redirects.redirect.source.type",
                                                defaultMessage: "Source type",
                                            })}
                                            name="sourceType"
                                            required
                                            fullWidth
                                        >
                                            {(props) => (
                                                <FinalFormSelect {...props} fullWidth>
                                                    {sourceTypeOptions.map((option) => (
                                                        <MenuItem value={option.value} key={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </FinalFormSelect>
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            label={intl.formatMessage({ id: "comet.pages.redirects.redirect.source", defaultMessage: "Source" })}
                                            name="source"
                                            required
                                            component={FinalFormInput}
                                            // @TODO: FIX ts-type here: https://github.com/vivid-planet/comet-admin/blob/next/packages/admin/src/form/Field.tsx#L18
                                            // type object doesnt work with "strict"
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            validate={validateSource as any}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Field
                                            name="target"
                                            label={intl.formatMessage({
                                                id: "comet.pages.redirects.redirect.target",
                                                defaultMessage: "Target",
                                            })}
                                            required
                                            fullWidth
                                            component={targetInput}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            label={intl.formatMessage({ id: "comet.pages.redirects.redirect.comment", defaultMessage: "Comment" })}
                                            name="comment"
                                            component={FinalFormInput}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
};
