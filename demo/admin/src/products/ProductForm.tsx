import { useApolloClient, useQuery } from "@apollo/client";
import {
    CheckboxField,
    Field,
    FinalForm,
    FinalFormSelect,
    FinalFormSubmitEvent,
    Loading,
    MainContent,
    SelectField,
    TextAreaField,
    TextField,
    useAsyncOptionsProps,
    useFormApiRef,
    useStackSwitchApi,
} from "@comet/admin";
import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
import { DamImageBlock, EditPageLayout, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { MenuItem, Select } from "@mui/material";
import { GQLProductType } from "@src/graphql.generated";
import { FormApi } from "final-form";
import { filter } from "graphql-anywhere";
import isEqual from "lodash.isequal";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import {
    createProductMutation,
    productCategoriesQuery,
    productFormFragment,
    productManufacturersQuery,
    productQuery,
    productTagsQuery,
    updateProductMutation,
} from "./ProductForm.gql";
import {
    GQLCreateProductMutation,
    GQLCreateProductMutationVariables,
    GQLProductCategoriesQuery,
    GQLProductCategoriesQueryVariables,
    GQLProductCategorySelectFragment,
    GQLProductFormManualFragment,
    GQLProductManufacturerSelectFragment,
    GQLProductManufacturersQuery,
    GQLProductManufacturersQueryVariables,
    GQLProductQuery,
    GQLProductQueryVariables,
    GQLProductTagsQuery,
    GQLProductTagsQueryVariables,
    GQLProductTagsSelectFragment,
    GQLUpdateProductMutation,
    GQLUpdateProductMutationVariables,
} from "./ProductForm.gql.generated";

interface FormProps {
    id?: string;
    manufacturerSelectVariables?: GQLProductManufacturersQueryVariables; // Used to restrict options in different cases. manufacturerSelectVariables should be required if there are any required vars
}

const rootBlocks = {
    image: DamImageBlock,
};

type FormValues = Omit<GQLProductFormManualFragment, "image"> & {
    image: BlockState<typeof rootBlocks.image>;
};

export function ProductForm({ id, manufacturerSelectVariables }: FormProps): React.ReactElement {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();

    const { data, error, loading, refetch } = useQuery<GQLProductQuery, GQLProductQueryVariables>(
        productQuery,
        id ? { variables: { id } } : { skip: true },
    );
    const [manufacturerCountrySelectValue, setManufacturerCountrySelectValue] = useState<string | undefined>(undefined);

    const initialValues: Partial<FormValues> = data?.product
        ? {
              ...filter<GQLProductFormManualFragment>(productFormFragment, data.product),
              image: rootBlocks.image.input2State(data.product.image),
          }
        : {
              image: rootBlocks.image.defaultValues(),
              inStock: false,
              tags: [],
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
            image: rootBlocks.image.state2Output(formValues.image),
            type: formValues.type as GQLProductType,
            category: formValues.category?.id,
            manufacturer: formValues.manufacturer?.id,
            tags: formValues.tags.map((i) => i.id),
            articleNumbers: [],
            discounts: [],
            statistics: { views: 0 },
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            await client.mutate<GQLUpdateProductMutation, GQLUpdateProductMutationVariables>({
                mutation: updateProductMutation,
                variables: { id, input: output },
            });
        } else {
            const { data: mutationResponse } = await client.mutate<GQLCreateProductMutation, GQLCreateProductMutationVariables>({
                mutation: createProductMutation,
                variables: { input: output },
            });
            if (!event.navigatingBack) {
                const id = mutationResponse?.createProduct.id;
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
        const tags = await client.query<GQLProductTagsQuery, GQLProductTagsQueryVariables>({ query: productTagsQuery });
        return tags.data.productTags.nodes;
    });

    const { refetch: manufacturerSelectAsyncPropsRefetch, ...manufacturerSelectAsyncProps } = useAsyncOptionsProps(async () => {
        const manufacturers = await client.query<GQLProductManufacturersQuery, GQLProductManufacturersQueryVariables>({
            query: productManufacturersQuery,
            variables: {
                ...manufacturerSelectVariables,
                filter: {
                    and: [
                        ...(manufacturerSelectVariables?.filter ? [manufacturerSelectVariables.filter] : []),
                        { addressAsEmbeddable_country: { equal: manufacturerCountrySelectValue } },
                    ],
                },
            },
        });
        return manufacturers.data.manufacturers.nodes;
    });

    if (error) throw error;

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <FinalForm<FormValues>
            apiRef={formApiRef}
            onSubmit={handleSubmit}
            mode={mode}
            initialValues={initialValues}
            initialValuesEqual={isEqual} //required to compare block data correctly
            subscription={{}}
        >
            {() => (
                <EditPageLayout>
                    {saveConflict.dialogs}
                    <MainContent>
                        <TextField required fullWidth name="title" label={<FormattedMessage id="product.title" defaultMessage="Title" />} />
                        <TextField required fullWidth name="slug" label={<FormattedMessage id="product.slug" defaultMessage="Slug" />} />
                        <TextAreaField
                            required
                            fullWidth
                            name="description"
                            label={<FormattedMessage id="product.description" defaultMessage="Description" />}
                        />
                        <SelectField name="type" label="Type" required fullWidth>
                            <MenuItem value="Cap">Cap</MenuItem>
                            <MenuItem value="Shirt">Shirt</MenuItem>
                            <MenuItem value="Tie">Tie</MenuItem>
                        </SelectField>
                        <Field
                            fullWidth
                            name="category"
                            label="Category"
                            component={FinalFormSelect}
                            {...categorySelectAsyncProps}
                            getOptionLabel={(option: GQLProductCategorySelectFragment) => option.title}
                        />
                        <Field
                            fullWidth
                            name="tags"
                            label="Tags"
                            component={FinalFormSelect}
                            multiple
                            {...tagsSelectAsyncProps}
                            getOptionLabel={(option: GQLProductTagsSelectFragment) => option.title}
                        />
                        {!manufacturerSelectVariables && (
                            <>
                                <Select
                                    name="country"
                                    label="Country"
                                    value={manufacturerCountrySelectValue ?? data?.product.manufacturer?.address?.country}
                                    fullWidth
                                    onChange={(event) => {
                                        setManufacturerCountrySelectValue(event.target.value);
                                        formApiRef?.current?.change("manufacturer", null); // reset select-value on change
                                        manufacturerSelectAsyncPropsRefetch();
                                    }}
                                >
                                    <MenuItem value="">
                                        <FormattedMessage id="product.manufacturer.country.noSelection" defaultMessage="No selection" />
                                    </MenuItem>
                                    <MenuItem value="AT">AT</MenuItem>
                                    <MenuItem value="DE">DE</MenuItem>
                                </Select>
                            </>
                        )}
                        <Field
                            fullWidth
                            name="manufacturer"
                            label={<FormattedMessage id="product.manufacturer" defaultMessage="Manufacturer" />}
                            component={FinalFormSelect}
                            {...manufacturerSelectAsyncProps}
                            getOptionLabel={(option: GQLProductManufacturerSelectFragment) =>
                                option.address?.street ? option.address?.street : "unknown"
                            }
                        />
                        <CheckboxField name="inStock" label={<FormattedMessage id="product.inStock" defaultMessage="In stock" />} fullWidth />
                        <Field name="image" isEqual={isEqual}>
                            {createFinalFormBlock(rootBlocks.image)}
                        </Field>
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}
