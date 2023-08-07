import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormCheckbox,
    FinalFormInput,
    FinalFormSelect,
    MainContent,
    messages,
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
import { CircularProgress, FormControlLabel, IconButton, MenuItem } from "@mui/material";
import {
    GQLProductFormCreateProductMutation,
    GQLProductFormCreateProductMutationVariables,
    GQLProductFormFragment,
    GQLProductFormUpdateProductMutation,
    GQLProductFormUpdateProductMutationVariables,
    GQLProductQuery,
    GQLProductQueryVariables,
    GQLProductType,
} from "@src/graphql.generated";
import { FORM_ERROR } from "final-form";
import { filter } from "graphql-anywhere";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { createProductMutation, productFormFragment, productQuery, updateProductMutation } from "./ProductForm.gql";

interface FormProps {
    id?: string;
}

type FormState = Omit<GQLProductFormFragment, "price"> & {
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
            type: formState.type as GQLProductType,
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

    const { data, error, loading } = useQuery<GQLProductQuery, GQLProductQueryVariables>(productQuery, id ? { variables: { id } } : { skip: true });

    const initialValues = data?.product ? filter(productFormFragment, data.product) : { inStock: false };

    if (error) {
        return <FormattedMessage id="common.error" defaultMessage="An error has occurred. Please try again at later" />;
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
            subscription={{}}
        >
            {({ pristine, hasValidationErrors, submitting, handleSubmit, hasSubmitErrors }) => (
                <EditPageLayout>
                    <Toolbar>
                        <ToolbarItem>
                            <IconButton onClick={stackApi?.goBack}>
                                <ArrowLeft />
                            </IconButton>
                        </ToolbarItem>
                        <ToolbarTitleItem>
                            <Field name="title">
                                {({ input }) =>
                                    input.value ? input.value : <FormattedMessage id="products.productDetail" defaultMessage="Product Detail" />
                                }
                            </Field>
                        </ToolbarTitleItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <SplitButton disabled={pristine || hasValidationErrors || submitting} localStorageKey="editInspirationSave">
                                <SaveButton color="primary" variant="contained" hasErrors={hasSubmitErrors} type="submit">
                                    <FormattedMessage {...messages.save} />
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
                                    <FormattedMessage {...messages.saveAndGoBack} />
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
                            label={intl.formatMessage({ id: "product.title", defaultMessage: "Title" })}
                        />
                        <Field
                            required
                            fullWidth
                            name="slug"
                            component={FinalFormInput}
                            label={intl.formatMessage({ id: "product.slug", defaultMessage: "Slug" })}
                        />
                        <Field
                            required
                            fullWidth
                            multiline
                            rows={5}
                            name="description"
                            component={FinalFormInput}
                            label={intl.formatMessage({ id: "product.description", defaultMessage: "Description" })}
                        />
                        <Field name="type" label="Type" required fullWidth>
                            {(props) => (
                                <FinalFormSelect {...props} fullWidth>
                                    <MenuItem value="Cap">Cap</MenuItem>
                                    <MenuItem value="Shirt">Shirt</MenuItem>
                                    <MenuItem value="Tie">Tie</MenuItem>
                                </FinalFormSelect>
                            )}
                        </Field>
                        <Field
                            fullWidth
                            name="price"
                            component={FinalFormInput}
                            inputProps={{ type: "number" }}
                            label={intl.formatMessage({ id: "product.price", defaultMessage: "Price" })}
                        />
                        <Field name="inStock" label="" type="checkbox" fullWidth>
                            {(props) => (
                                <FormControlLabel
                                    label={intl.formatMessage({ id: "product.inStock", defaultMessage: "In stock" })}
                                    control={<FinalFormCheckbox {...props} />}
                                />
                            )}
                        </Field>
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}

export default ProductForm;
