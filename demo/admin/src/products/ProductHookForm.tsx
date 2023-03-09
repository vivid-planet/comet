import { useMutation, useQuery } from "@apollo/client";
import {
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
import { Checkbox, CircularProgress, FormControlLabel, FormLabel, IconButton, InputBase } from "@mui/material";
import { styled } from "@mui/system";
import {
    GQLProductFormCreateProductMutation,
    GQLProductFormCreateProductMutationVariables,
    GQLProductFormFragment,
    GQLProductFormUpdateProductMutation,
    GQLProductFormUpdateProductMutationVariables,
    GQLProductQuery,
    GQLProductQueryVariables,
} from "@src/graphql.generated";
import React, { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { createProductMutation, productQuery, updateProductMutation } from "./ProductForm.gql";

interface FormProps {
    id?: string;
}

type FormState = Omit<GQLProductFormFragment, "id" | "price"> & { price: string };

function ProductHookForm({ id }: FormProps): React.ReactElement {
    const intl = useIntl();
    const stackApi = useStackApi();
    const mode = id ? "edit" : "add";
    const { data, error, loading } = useQuery<GQLProductQuery, GQLProductQueryVariables>(productQuery, id ? { variables: { id } } : { skip: true });
    const [updateProduct] = useMutation<GQLProductFormUpdateProductMutation, GQLProductFormUpdateProductMutationVariables>(updateProductMutation);
    const [createProduct] = useMutation<GQLProductFormCreateProductMutation, GQLProductFormCreateProductMutationVariables>(createProductMutation);

    const defaultValues: FormState = useMemo(
        () => ({
            title: data?.product.title ?? "",
            description: data?.product.description ?? "",
            price: data?.product.price?.toString() ?? "",
            slug: data?.product.slug ?? "",
            inStock: data?.product.inStock ?? false,
        }),
        [data],
    );

    const {
        register,
        setError,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors, isDirty, isSubmitSuccessful, isSubmitted },
        control,
    } = useForm({ defaultValues, mode: "onChange" });

    useEffect(() => {
        reset(defaultValues);
    }, [reset, defaultValues]);

    const title = useWatch({ control, name: "title" });

    const onSubmit = async (formState: FormState) => {
        const input = {
            ...formState,
            price: parseFloat(formState.price),
        };

        try {
            if (mode === "edit") {
                if (!id) throw new Error();
                await updateProduct({
                    variables: { id, input },
                });
            } else {
                await createProduct({
                    variables: { input },
                });
            }
        } catch (e) {
            setError("root.serverError", {
                type: "400",
            });
        }
    };

    if (error) {
        return <FormattedMessage id="demo.common.error" defaultMessage="Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal." />;
    }

    if (loading) {
        return <CircularProgress />;
    }

    const hasErrors = Object.values(errors).length > 0 || (isSubmitted && !isSubmitSuccessful);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <EditPageLayout>
                <Toolbar>
                    <ToolbarItem>
                        <IconButton onClick={stackApi?.goBack}>
                            <ArrowLeft />
                        </IconButton>
                    </ToolbarItem>
                    <ToolbarTitleItem>
                        {title ? title : <FormattedMessage id="comet.products.productDetail" defaultMessage="Product Detail" />}
                    </ToolbarTitleItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <SplitButton disabled={!isDirty || hasErrors || isSubmitting}>
                            <SaveButton color="primary" variant="contained" saving={isSubmitting} hasErrors={hasErrors} type="submit">
                                <FormattedMessage {...messages.save} />
                            </SaveButton>
                            <SaveButton
                                color="primary"
                                variant="contained"
                                saving={isSubmitting}
                                hasErrors={hasErrors}
                                type="button"
                                onClick={async () => {
                                    // TODO
                                }}
                            >
                                <FormattedMessage {...messages.saveAndGoBack} />
                            </SaveButton>
                        </SplitButton>
                    </ToolbarActions>
                </Toolbar>
                <MainContent>
                    <Field>
                        <FormLabel>
                            <FormattedMessage id="demo.product.title" defaultMessage="Titel" />*
                        </FormLabel>
                        <InputBase {...register("title", { required: true })} fullWidth />
                        {errors["title"]?.type === "required" && <p>This field is required</p>}
                    </Field>
                    <Field>
                        <FormLabel>
                            <FormattedMessage id="demo.product.slug" defaultMessage="Slug" />*
                        </FormLabel>
                        <InputBase {...register("slug", { required: true })} fullWidth />
                        {errors["slug"]?.type === "required" && <p>This field is required</p>}
                    </Field>
                    <Field>
                        <FormLabel>
                            <FormattedMessage id="demo.product.description" defaultMessage="Beschreibung" />*
                        </FormLabel>
                        <InputBase {...register("description", { required: true })} multiline rows={5} fullWidth />
                        {errors["description"]?.type === "required" && <p>This field is required</p>}
                    </Field>
                    <Field>
                        <FormLabel>
                            <FormattedMessage id="demo.product.price" defaultMessage="Preis" />
                        </FormLabel>
                        <InputBase {...register("price")} inputProps={{ type: "number" }} fullWidth />
                    </Field>
                    <Field>
                        <FormControlLabel
                            control={<Checkbox {...register("inStock")} />}
                            label={intl.formatMessage({ id: "demo.product.inStock", defaultMessage: "Auf Lager" })}
                        />
                    </Field>
                </MainContent>
            </EditPageLayout>
        </form>
    );
}

const Field = styled("div")`
    margin-bottom: 20px;
`;

export default ProductHookForm;
