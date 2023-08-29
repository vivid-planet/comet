import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormCheckbox,
    FinalFormInput,
    FinalFormSaveSplitButton,
    FinalFormSelect,
    FinalFormSubmitEvent,
    MainContent,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    ToolbarTitleItem,
    useAsyncOptionsProps,
    useFormApiRef,
    useStackApi,
    useStackSwitchApi,
} from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
import { DamImageBlock, EditPageLayout, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { CircularProgress, FormControlLabel, IconButton, MenuItem } from "@mui/material";
import { GQLProductType } from "@src/graphql.generated";
import { FormApi } from "final-form";
import { filter } from "graphql-anywhere";
import isEqual from "lodash.isequal";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
    createProductMutation,
    productCategoriesQuery,
    productFormFragment,
    productQuery,
    productTagsQuery,
    updateProductMutation,
} from "./ProductForm.gql";
import {
    GQLProductCategoriesQuery,
    GQLProductCategoriesQueryVariables,
    GQLProductCategorySelectFragment,
    GQLProductFormCreateProductMutation,
    GQLProductFormCreateProductMutationVariables,
    GQLProductFormFragment,
    GQLProductFormUpdateProductMutation,
    GQLProductFormUpdateProductMutationVariables,
    GQLProductQuery,
    GQLProductQueryVariables,
    GQLProductTagsQuery,
    GQLProductTagsSelectFragment,
} from "./ProductForm.gql.generated";
import { GQLProductTagsListQueryVariables } from "./tags/ProductTagTable.generated";

interface FormProps {
    id?: string;
}

const rootBlocks = {
    image: DamImageBlock,
};

type FormValues = Omit<GQLProductFormFragment, "price" | "image"> & {
    price: string;
    image: BlockState<typeof rootBlocks.image>;
};

function ProductForm({ id }: FormProps): React.ReactElement {
    const stackApi = useStackApi();
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();

    const { data, error, loading, refetch } = useQuery<GQLProductQuery, GQLProductQueryVariables>(
        productQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues: Partial<FormValues> = data?.product
        ? {
              ...filter<GQLProductFormFragment>(productFormFragment, data.product),
              price: String(data.product.price),
              image: rootBlocks.image.input2State(data.product.image),
          }
        : {
              image: rootBlocks.image.defaultValues(),
              inStock: false,
          };

    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            const updatedAt = await queryUpdatedAt(client, "product", id);
            return resolveHasSaveConflict(data?.product.updatedAt, updatedAt);
        },
        formApiRef,
        loadLatestVersion: async () => {
            await refetch();
        },
    });

    const handleSubmit = async (formValues: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
        if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");
        const output = {
            ...formValues,
            price: parseFloat(formValues.price),
            image: rootBlocks.image.state2Output(formValues.image),
            type: formValues.type as GQLProductType,
            category: formValues.category?.id,
            tags: formValues.tags.map((i) => i.id),
            variants: [],
            articleNumbers: [],
            discounts: [],
            packageDimensions: { width: 0, height: 0, depth: 0 },
            statistics: { views: 0 },
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            await client.mutate<GQLProductFormUpdateProductMutation, GQLProductFormUpdateProductMutationVariables>({
                mutation: updateProductMutation,
                variables: { id, input: output, lastUpdatedAt: data?.product.updatedAt },
            });
        } else {
            const { data: mutationReponse } = await client.mutate<GQLProductFormCreateProductMutation, GQLProductFormCreateProductMutationVariables>({
                mutation: createProductMutation,
                variables: { input: output },
            });
            if (!event.navigatingBack) {
                const id = mutationReponse?.createProduct.id;
                if (id) {
                    setTimeout(() => {
                        stackSwitchApi.activatePage(`edit`, id);
                    });
                }
            }
        }
    };

    const categorySelectAsyncProps = useAsyncOptionsProps(async () => {
        const categories = await client.query<GQLProductCategoriesQuery, GQLProductCategoriesQueryVariables>({ query: productCategoriesQuery });
        return categories.data.productCategories.nodes;
    });
    const tagsSelectAsyncProps = useAsyncOptionsProps(async () => {
        const tags = await client.query<GQLProductTagsQuery, GQLProductTagsListQueryVariables>({ query: productTagsQuery });
        return tags.data.productTags.nodes;
    });

    if (error) {
        return <FormattedMessage id="common.error" defaultMessage="An error has occurred. Please try again at later" />;
    }

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <FinalForm<FormValues>
            apiRef={formApiRef}
            onSubmit={handleSubmit}
            mode={mode}
            initialValues={initialValues}
            initialValuesEqual={isEqual} //required to compare block data correctly
            onAfterSubmit={(values, form) => {
                //don't go back automatically TODO remove this automatismn
            }}
            subscription={{}}
        >
            {() => (
                <EditPageLayout>
                    {saveConflict.dialogs}
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
                            <FinalFormSaveSplitButton />
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <Field
                            required
                            fullWidth
                            name="title"
                            component={FinalFormInput}
                            label={<FormattedMessage id="product.title" defaultMessage="Title" />}
                        />
                        <Field
                            required
                            fullWidth
                            name="slug"
                            component={FinalFormInput}
                            label={<FormattedMessage id="product.slug" defaultMessage="Slug" />}
                        />
                        <Field
                            required
                            fullWidth
                            multiline
                            rows={5}
                            name="description"
                            component={FinalFormInput}
                            label={<FormattedMessage id="product.description" defaultMessage="Description" />}
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
                            name="category"
                            label="Category"
                            component={FinalFormSelect}
                            {...categorySelectAsyncProps}
                            getOptionLabel={(option: GQLProductCategorySelectFragment) => option.title}
                            getOptionSelected={(option: GQLProductCategorySelectFragment, value: GQLProductCategorySelectFragment) => {
                                return option.id === value.id;
                            }}
                        />
                        <Field
                            fullWidth
                            name="tags"
                            label="Tags"
                            component={FinalFormSelect}
                            multiple
                            {...tagsSelectAsyncProps}
                            getOptionLabel={(option: GQLProductTagsSelectFragment) => option.title}
                            getOptionSelected={(option: GQLProductTagsSelectFragment, value: GQLProductTagsSelectFragment) => {
                                return option.id === value.id;
                            }}
                        />
                        <Field
                            fullWidth
                            name="price"
                            component={FinalFormInput}
                            inputProps={{ type: "number" }}
                            label={<FormattedMessage id="product.price" defaultMessage="Price" />}
                        />
                        <Field name="inStock" label="" type="checkbox" fullWidth>
                            {(props) => (
                                <FormControlLabel
                                    label={<FormattedMessage id="product.inStock" defaultMessage="In stock" />}
                                    control={<FinalFormCheckbox {...props} />}
                                />
                            )}
                        </Field>
                        <Field name="image" isEqual={isEqual}>
                            {createFinalFormBlock(rootBlocks.image)}
                        </Field>
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}

export default ProductForm;
