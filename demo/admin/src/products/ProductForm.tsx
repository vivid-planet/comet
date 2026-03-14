import { useApolloClient, useQuery } from "@apollo/client";
import { filterByFragment, Loading, RHFForm, RHFTextField } from "@comet/admin";
import {
    type BlockState,
    DamImageBlock,
    type GQLFinalFormFileUploadFragment,
    queryUpdatedAt,
    resolveHasSaveConflict,
    useSaveConflict,
} from "@comet/cms-admin";
import { type GQLProductMutationErrorCode, type GQLProductType } from "@src/graphql.generated";
import { type ReactNode, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { createProductMutation, productFormFragment, productQuery, updateProductMutation } from "./ProductForm.gql";
import {
    type GQLCreateProductMutation,
    type GQLCreateProductMutationVariables,
    type GQLProductFormManualFragment,
    type GQLProductQuery,
    type GQLProductQueryVariables,
    type GQLUpdateProductMutation,
    type GQLUpdateProductMutationVariables,
} from "./ProductForm.gql.generated";

interface FormProps {
    id?: string;
    width?: number;
    onCreate?: (id: string) => void;
}

const rootBlocks = {
    image: DamImageBlock,
};

// Set types for FinalFormFileUpload manually, as they cannot be generated from the fragment in `@comet/cms-admin`
type ProductFormManualFragment = Omit<GQLProductFormManualFragment, "priceList" | "datasheets"> & {
    priceList: GQLFinalFormFileUploadFragment | null;
    datasheets: Array<GQLFinalFormFileUploadFragment>;
};

type FormValues = Omit<ProductFormManualFragment, "image" | "lastCheckedAt" | "title" | "slug"> & {
    title: string | null;
    slug: string | null;
    image: BlockState<typeof rootBlocks.image>;
    manufacturerCountry?: { id: string; label: string };
    lastCheckedAt?: Date | null;
};

const submissionErrorMessages: { [K in GQLProductMutationErrorCode]: ReactNode } = {
    titleTooShort: (
        <FormattedMessage
            id="product.form.error.titleTooShort"
            defaultMessage="Title must be at least 3 characters long when creating a product, except for foo"
        />
    ),
};

export function ProductForm({ id, width, onCreate }: FormProps) {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";

    const { data, error, loading, refetch } = useQuery<GQLProductQuery, GQLProductQueryVariables>(
        productQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const filteredData = data ? filterByFragment<ProductFormManualFragment>(productFormFragment, data.product) : undefined;
    const formValues: FormValues | undefined = filteredData
        ? {
              ...filteredData,
              image: rootBlocks.image.input2State(filteredData.image),
              manufacturerCountry: filteredData.manufacturer
                  ? { id: filteredData.manufacturer.addressAsEmbeddable.country, label: filteredData.manufacturer.addressAsEmbeddable.country }
                  : undefined,
              lastCheckedAt: filteredData.lastCheckedAt ? new Date(filteredData.lastCheckedAt) : null,
          }
        : undefined;

    const form = useForm<FormValues>({
        defaultValues: {
            title: null,
            slug: null,
            inStock: false,
            additionalTypes: [],
            tags: [],
            image: rootBlocks.image.defaultValues(),
            dimensions: width !== undefined ? { width } : undefined,
        },
        values: formValues,
        resetOptions: {
            keepDirtyValues: true,
        },
    });
    const { control, setError } = form;

    const saveConflict = useSaveConflict({
        checkConflict: async () => {
            const updatedAt = await queryUpdatedAt(client, "product", id);
            return resolveHasSaveConflict(data?.product.updatedAt, updatedAt);
        },
        hasChanges: () => form.formState.isDirty,
        loadLatestVersion: async () => {
            await refetch();
        },
        onDiscardButtonPressed: async () => {
            form.reset();
            await refetch();
        },
    });

    const onSubmit = useCallback(
        async ({ manufacturerCountry, ...formValues }: FormValues) => {
            if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");

            const output = {
                ...formValues,
                title: formValues.title ?? "", // required field, validated by form
                slug: formValues.slug ?? "", // required field, validated by form
                description: formValues.description ?? null,
                image: rootBlocks.image.state2Output(formValues.image),
                type: formValues.type as GQLProductType,
                category: formValues.category ? formValues.category.id : null,
                tags: formValues.tags.map((i) => i.id),
                articleNumbers: [],
                discounts: [],
                statistics: { views: 0 },
                priceList: formValues.priceList ? formValues.priceList.id : null,
                datasheets: formValues.datasheets?.map(({ id }) => id),
                manufacturer: formValues.manufacturer?.id,
                lastCheckedAt: formValues.lastCheckedAt ? formValues.lastCheckedAt.toISOString() : null,
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
                if (mutationResponse?.createProduct.errors.length) {
                    mutationResponse.createProduct.errors.forEach((error) => {
                        const errorMessage = submissionErrorMessages[error.code];
                        if (error.field) {
                            setError(error.field as keyof FormValues, { message: String(errorMessage) });
                        } else {
                            setError("root", { message: String(errorMessage) });
                        }
                    });
                    throw new Error("Submit errors");
                }
                const newId = mutationResponse?.createProduct.product?.id;
                if (newId) {
                    setTimeout(() => {
                        onCreate?.(newId);
                    }, 0);
                }
            }
        },
        [client, id, mode, onCreate, saveConflict, setError],
    );

    if (error) throw error;

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <RHFForm onSubmit={onSubmit} {...form}>
            {saveConflict.dialogs}
            <RHFTextField required fullWidth control={control} name="title" label={<FormattedMessage id="product.title" defaultMessage="Title" />} />
            <RHFTextField required fullWidth control={control} name="slug" label={<FormattedMessage id="product.slug" defaultMessage="Slug" />} />

            {/* TODO: Not yet implemented in RHF - will be added later */}
            {/*
            <Field
                name="priceRange"
                label={<FormattedMessage id="product.priceRange" defaultMessage="Price range" />}
                fullWidth
                component={FinalFormRangeInput}
                min={5}
                max={100}
                startAdornment={<InputAdornment position="start">€</InputAdornment>}
                disableSlider
            />
            <TextAreaField fullWidth name="description" label={<FormattedMessage id="product.description" defaultMessage="Description" />} />
            <DateField
                required
                fullWidth
                name="availableSince"
                label={<FormattedMessage id="product.availableSince" defaultMessage="Available Since" />}
            />
            <FutureProductNotice />
            <AsyncSelectField
                name="manufacturerCountry"
                loadOptions={async () => {
                    const { data } = await client.query<GQLManufacturerCountriesQuery, GQLManufacturerCountriesQueryVariables>({
                        query: gql`
                            query ManufacturerCountries {
                                manufacturerCountries {
                                    nodes {
                                        id
                                        label
                                    }
                                }
                            }
                        `,
                    });
                    return data.manufacturerCountries.nodes;
                }}
                getOptionLabel={(option) => option.label}
                label={<FormattedMessage id="product.manufacturerCountry" defaultMessage="Manufacturer Country" />}
                fullWidth
            />
            <AsyncSelectField
                name="manufacturer"
                loadOptions={async () => {
                    const { data } = await client.query<GQLManufacturersQuery, GQLManufacturersQueryVariables>({
                        query: gql`
                            query Manufacturers($filter: ManufacturerFilter) {
                                manufacturers(filter: $filter) {
                                    nodes {
                                        id
                                        name
                                    }
                                }
                            }
                        `,
                        variables: {
                            filter: {
                                addressAsEmbeddable_country: {
                                    equal: values.manufacturerCountry?.id,
                                },
                            },
                        },
                    });
                    return data.manufacturers.nodes;
                }}
                getOptionLabel={(option) => option.name}
                label={<FormattedMessage id="product.manufacturer" defaultMessage="Manufacturer" />}
                fullWidth
                disabled={!values?.manufacturerCountry}
            />
            <SelectField name="type" label={<FormattedMessage id="product.type" defaultMessage="Type" />} required fullWidth>
                <MenuItem value="cap">
                    <FormattedMessage id="product.type.cap" defaultMessage="Cap" />
                </MenuItem>
                <MenuItem value="shirt">
                    <FormattedMessage id="product.type.shirt" defaultMessage="Shirt" />
                </MenuItem>
                <MenuItem value="tie">
                    <FormattedMessage id="product.type.tie" defaultMessage="Tie" />
                </MenuItem>
            </SelectField>
            <SelectField
                name="additionalTypes"
                label={<FormattedMessage id="product.additionalTypes" defaultMessage="Additional Types" />}
                fullWidth
                multiple
            >
                <MenuItem value="cap">
                    <FormattedMessage id="product.type.cap" defaultMessage="Cap" />
                </MenuItem>
                <MenuItem value="shirt">
                    <FormattedMessage id="product.type.shirt" defaultMessage="Shirt" />
                </MenuItem>
                <MenuItem value="tie">
                    <FormattedMessage id="product.type.tie" defaultMessage="Tie" />
                </MenuItem>
            </SelectField>
            <AsyncSelectField
                fullWidth
                name="category"
                label={<FormattedMessage id="product.category" defaultMessage="Category" />}
                loadOptions={async () => {
                    const { data } = await client.query<GQLProductCategoriesSelectQuery, GQLProductCategoriesSelectQueryVariables>({
                        query: gql`
                            query ProductCategoriesSelect {
                                productCategories {
                                    nodes {
                                        id
                                        title
                                    }
                                }
                            }
                        `,
                    });
                    return data.productCategories.nodes;
                }}
                getOptionLabel={(option) => option.title}
            />
            <AsyncSelectField
                fullWidth
                name="tags"
                label={<FormattedMessage id="product.tags" defaultMessage="Tags" />}
                multiple
                loadOptions={async () => {
                    const { data } = await client.query<GQLProductTagsSelectQuery, GQLProductTagsSelectQueryVariables>({
                        query: gql`
                            query ProductTagsSelect {
                                productTags {
                                    nodes {
                                        id
                                        title
                                    }
                                }
                            }
                        `,
                    });
                    return data.productTags.nodes;
                }}
                getOptionLabel={(option) => option.title}
            />
            <CheckboxField name="inStock" label={<FormattedMessage id="product.inStock" defaultMessage="In stock" />} fullWidth />
            <Field name="image" isEqual={isEqual}>
                {createFinalFormBlock(rootBlocks.image)}
            </Field>
            <FileUploadField
                label={<FormattedMessage id="product.priceList" defaultMessage="Price List" />}
                name="priceList"
                maxFileSize={1024 * 1024 * 4} // 4 MB
                fullWidth
            />
            <FileUploadField
                label={<FormattedMessage id="product.datasheets" defaultMessage="Datasheets" />}
                name="datasheets"
                multiple
                maxFileSize={1024 * 1024 * 4} // 4 MB
                fullWidth
                layout="grid"
            />
            <DateTimeField
                label={<FormattedMessage id="product.lastCheckedAt" defaultMessage="Last checked at" />}
                name="lastCheckedAt"
                fullWidth
            />
            */}
        </RHFForm>
    );
}
