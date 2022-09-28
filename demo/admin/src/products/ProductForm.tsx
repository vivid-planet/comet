import { useApolloClient, useQuery } from "@apollo/client";
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
import { ArrowLeft } from "@comet/admin-icons";
import { EditPageLayout } from "@comet/cms-admin";
import { CircularProgress, IconButton } from "@mui/material";
import {
    GQLProductFormCreateProductMutation,
    GQLProductFormCreateProductMutationVariables,
    GQLProductFormFragmentFragment,
    GQLProductFormUpdateProductMutation,
    GQLProductFormUpdateProductMutationVariables,
    GQLProductQuery,
    GQLProductQueryVariables,
} from "@src/graphql.generated";
import { FORM_ERROR } from "final-form";
import { filter } from "graphql-anywhere";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { createProductMutation, productFormFragment, productQuery, updateProductMutation } from "./ProductForm.gql";

interface FormProps {
    id?: string;
}

type FormState = Omit<GQLProductFormFragmentFragment, "price"> & {
    price: string;
};

function ProductForm({ id }: FormProps): React.ReactElement {
    const intl = useIntl();
    const stackApi = useStackApi();
    const client = useApolloClient();
    const mode = id ? "edit" : "add";

    const handleSubmit = async (formState: FormState) => {
        const input = {
            ...formState,
            price: parseFloat(formState.price),
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            await client.mutate<GQLProductFormUpdateProductMutation, GQLProductFormUpdateProductMutationVariables>({
                mutation: updateProductMutation,
                variables: { id, input },
            });
        } else {
            await client.mutate<GQLProductFormCreateProductMutation, GQLProductFormCreateProductMutationVariables>({
                mutation: createProductMutation,
                variables: { input },
            });
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { data, error, loading } = useQuery<GQLProductQuery, GQLProductQueryVariables>(productQuery, { variables: { id: id! }, skip: !id });

    const initialValues = data?.product ? filter(productFormFragment, data.product) : {};

    if (error) {
        return <FormattedMessage id="demo.common.error" defaultMessage="Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal." />;
    }

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <FinalForm<FormState>
            onSubmit={handleSubmit}
            mode={mode}
            initialValues={initialValues}
            renderButtons={() => null}
            onAfterSubmit={(values, form) => {
                //don't go back automatically
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
                            {values.title ? values.title : <FormattedMessage id="comet.products.productDetail" defaultMessage="Product Detail" />}
                        </ToolbarTitleItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey="editInspirationSave">
                                <SaveButton color="primary" variant="contained" hasErrors={hasSubmitErrors} type="submit">
                                    <FormattedMessage id="comet.generic.save" defaultMessage="Save" />
                                </SaveButton>
                                <SaveButton
                                    color="primary"
                                    variant="contained"
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
                            required
                            fullWidth
                            name="title"
                            component={FinalFormInput}
                            label={intl.formatMessage({ id: "demo.product.title", defaultMessage: "Titel" })}
                        />
                        <Field
                            required
                            fullWidth
                            name="slug"
                            component={FinalFormInput}
                            label={intl.formatMessage({ id: "demo.product.slug", defaultMessage: "Slug" })}
                        />
                        <Field
                            required
                            fullWidth
                            multiline
                            rows={5}
                            name="description"
                            component={FinalFormInput}
                            label={intl.formatMessage({ id: "demo.product.description", defaultMessage: "Beschreibung" })}
                        />
                        <Field
                            fullWidth
                            name="price"
                            component={FinalFormInput}
                            inputProps={{ type: "number" }}
                            label={intl.formatMessage({ id: "demo.product.description", defaultMessage: "Preis" })}
                        />
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}

export default ProductForm;
