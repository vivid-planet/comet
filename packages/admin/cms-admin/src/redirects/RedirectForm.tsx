import { useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormInput,
    FinalFormSelect,
    MainContent,
    SaveButton,
    SplitButton,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarTitleItem,
    useStackApi,
} from "@comet/admin";
import { isValidUrl } from "@comet/blocks-admin";
import { Card, CardContent, CircularProgress, Grid, MenuItem } from "@mui/material";
import { FORM_ERROR } from "final-form";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GQLRedirectDetailFragment, GQLRedirectDetailQuery, GQLRedirectDetailQueryVariables } from "../graphql.generated";
import { AllCategories } from "../pages/pageTree/PageTreeContext";
import FinalFormPageTreeSelect from "../pages/pageTreeSelect/FinalFormPageTreeSelect";
import { redirectDetailQuery } from "./RedirectForm.gql";
import { useSubmitMutation } from "./submitMutation";

interface IRedirectForm {
    id?: string;
    mode: "edit" | "add";
    allCategories: AllCategories;
}

const useInitialValues = (mode: "edit" | "add", id?: string) => {
    const { loading, data, error } = useQuery<GQLRedirectDetailQuery, GQLRedirectDetailQueryVariables>(redirectDetailQuery, {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        variables: { id: id! },
        skip: !id,
    });
    return { loading, data, error };
};

export const RedirectForm = ({ mode, id, allCategories }: IRedirectForm): JSX.Element => {
    const intl = useIntl();
    const initialValues = useInitialValues(mode, id);

    const sourceTypeOptions = [
        {
            value: "path",
            label: intl.formatMessage({
                id: "comet.pages.redirects.redirect.source.type.path",
                defaultMessage: "Path",
            }),
        },
    ];

    const targetTypeOptions = [
        {
            value: "intern",
            label: intl.formatMessage({
                id: "comet.pages.redirects.redirect.target.type.internalPage",
                defaultMessage: "Internal Page",
            }),
        },
        {
            value: "extern",
            label: intl.formatMessage({
                id: "comet.pages.redirects.redirect.target.type.extern",
                defaultMessage: "External URL",
            }),
        },
    ];

    const stackApi = useStackApi();

    const [submit, { loading: saving, error: saveError }] = useSubmitMutation(mode, id);

    if (mode === "edit" && initialValues.loading) {
        return <CircularProgress />;
    }

    const validateSourceType = (value: string, allValues: GQLRedirectDetailFragment) => {
        if (allValues.sourceType === "path") {
            if (!value.startsWith("/")) {
                return intl.formatMessage({ id: "comet.pages.redirects.validate.path.error", defaultMessage: "Needs to start with /" });
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
    const handleSaveClick = (values: GQLRedirectDetailFragment) => {
        return submit(values);
    };

    return (
        <FinalForm
            mode={mode}
            onSubmit={handleSaveClick}
            initialValues={{ ...initialValues?.data?.redirect, sourceType: "path" }}
            renderButtons={() => null}
            onAfterSubmit={(values, form) => {
                form.reset(values);
            }}
        >
            {({ values, pristine, hasValidationErrors, submitting, handleSubmit }) => (
                <>
                    <Toolbar>
                        <ToolbarBackButton />
                        <ToolbarTitleItem>
                            {values.source ? values.source : <FormattedMessage id="comet.redirects.defaultTitle" defaultMessage="Redirect Detail" />}
                        </ToolbarTitleItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey="editRedirectSave">
                                <SaveButton color="primary" variant="contained" saving={saving} hasErrors={saveError != null} type="submit">
                                    <FormattedMessage id="comet.generic.save" defaultMessage="Save" />
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
                                    <FormattedMessage id="comet.generic.saveAndGoBack" defaultMessage="Save and go back" />
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
                                            validate={validateSourceType as any}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Field
                                            label={intl.formatMessage({
                                                id: "comet.pages.redirects.redirect.target.type",
                                                defaultMessage: "Target Type",
                                            })}
                                            name="targetType"
                                            required
                                            fullWidth
                                        >
                                            {(props) => (
                                                <FinalFormSelect {...props} fullWidth>
                                                    {targetTypeOptions.map((option) => (
                                                        <MenuItem value={option.value} key={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </FinalFormSelect>
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <div>
                                            <Field name="targetType" subscription={{ value: true }} fullWidth>
                                                {({ input: { value } }) =>
                                                    value === "extern" && (
                                                        <Field
                                                            label={intl.formatMessage({
                                                                id: "comet.pages.redirects.redirect.target.url",
                                                                defaultMessage: "Url",
                                                            })}
                                                            name="targetUrl"
                                                            required
                                                            component={FinalFormInput}
                                                            validate={validateDomain}
                                                            fullWidth
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div>
                                            <Field name="targetType" subscription={{ value: true }} fullWidth>
                                                {({ input: { value } }) =>
                                                    value === "intern" && (
                                                        <Field
                                                            label={intl.formatMessage({
                                                                id: "comet.pages.redirects.redirect.target.pageId",
                                                                defaultMessage: "Target PageID",
                                                            })}
                                                            name="targetPage"
                                                            required
                                                            component={FinalFormPageTreeSelect}
                                                            allCategories={allCategories}
                                                            fullWidth
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
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
