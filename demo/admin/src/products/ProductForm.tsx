import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    AsyncSelectField,
    CheckboxField,
    Field,
    filterByFragment,
    FinalForm,
    FinalFormSubmitEvent,
    Loading,
    MainContent,
    OnChangeField,
    SelectField,
    TextAreaField,
    TextField,
    useFormApiRef,
    useStackSwitchApi,
} from "@comet/admin";
import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
import {
    DamImageBlock,
    FileUploadField,
    GQLFinalFormFileUploadFragment,
    queryUpdatedAt,
    resolveHasSaveConflict,
    useFormSaveConflict,
} from "@comet/cms-admin";
import { MenuItem } from "@mui/material";
import { GQLProductType } from "@src/graphql.generated";
import {
    GQLManufacturerCountriesQuery,
    GQLManufacturerCountriesQueryVariables,
    GQLManufacturersQuery,
    GQLManufacturersQueryVariables,
} from "@src/products/ProductForm.generated";
import { FormApi } from "final-form";
import isEqual from "lodash.isequal";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLProductCategoriesSelectQuery,
    GQLProductCategoriesSelectQueryVariables,
    GQLProductTagsSelectQuery,
    GQLProductTagsSelectQueryVariables,
} from "./ProductForm.generated";
import { createProductMutation, productFormFragment, productQuery, updateProductMutation } from "./ProductForm.gql";
import {
    GQLCreateProductMutation,
    GQLCreateProductMutationVariables,
    GQLProductFormManualFragment,
    GQLProductQuery,
    GQLProductQueryVariables,
    GQLUpdateProductMutation,
    GQLUpdateProductMutationVariables,
} from "./ProductForm.gql.generated";

interface FormProps {
    id?: string;
    manufacturerCountry?: string;
}

const rootBlocks = {
    image: DamImageBlock,
};

// Set types for FinalFormFileUpload manually, as they cannot be generated from the fragment in `@comet/cms-admin`
type ProductFormManualFragment = Omit<GQLProductFormManualFragment, "priceList" | "datasheets"> & {
    priceList: GQLFinalFormFileUploadFragment | null;
    datasheets: Array<GQLFinalFormFileUploadFragment>;
};

type FormValues = Omit<ProductFormManualFragment, "image" | "manufacturerCountry"> & {
    image: BlockState<typeof rootBlocks.image>;
    manufacturerCountry?: { id: string };
};

export function ProductForm({ id, manufacturerCountry }: FormProps): React.ReactElement {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();

    const { data, error, loading, refetch } = useQuery<GQLProductQuery, GQLProductQueryVariables>(
        productQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues: Partial<FormValues> = React.useMemo<Partial<FormValues>>(() => {
        const filteredData = data ? filterByFragment<ProductFormManualFragment>(productFormFragment, data.product) : undefined;
        if (!filteredData) {
            return {
                image: rootBlocks.image.defaultValues(),
                inStock: false,
                additionalTypes: [],
                tags: [],
            };
        }
        return {
            ...filteredData,
            image: rootBlocks.image.input2State(filteredData.image),
            manufacturerCountry: manufacturerCountry
                ? { id: manufacturerCountry }
                : filteredData.manufacturerCountry
                ? {
                      id: filteredData.manufacturerCountry?.addressAsEmbeddable.country,
                  }
                : undefined,
        };
    }, [data, manufacturerCountry]);

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

    const handleSubmit = async ({ manufacturerCountry, ...formValues }: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
        if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");

        const output = {
            ...formValues,
            image: rootBlocks.image.state2Output(formValues.image),
            type: formValues.type as GQLProductType,
            category: formValues.category?.id,
            tags: formValues.tags.map((i) => i.id),
            articleNumbers: [],
            discounts: [],
            statistics: { views: 0 },
            priceList: formValues.priceList ? formValues.priceList.id : null,
            datasheets: formValues.datasheets?.map(({ id }) => id),
            manufacturer: formValues.manufacturer?.id,
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
            subscription={{ values: true }} // values required because disable and loadOptions of manufacturer-select depends on values
        >
            {({ values, form }) => (
                <>
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
                        {!manufacturerCountry && (
                            <AsyncSelectField
                                name="manufacturerCountry"
                                loadOptions={async () => {
                                    const { data } = await client.query<GQLManufacturerCountriesQuery, GQLManufacturerCountriesQueryVariables>({
                                        query: gql`
                                            query ManufacturerCountries {
                                                manufacturerCountries {
                                                    nodes {
                                                        id
                                                        used
                                                    }
                                                }
                                            }
                                        `,
                                    });

                                    return data.manufacturerCountries.nodes;
                                }}
                                getOptionLabel={(option) => option.id}
                                label={<FormattedMessage id="product.manufacturerCountry" defaultMessage="Manufacturer Country" />}
                                fullWidth
                            />
                        )}
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
                        <OnChangeField name="manufacturerCountry">
                            {(value, previousValue) => {
                                if (value.id !== previousValue.id) {
                                    form.change("manufacturer", undefined);
                                }
                            }}
                        </OnChangeField>
                        <SelectField name="type" label={<FormattedMessage id="product.type" defaultMessage="Type" />} required fullWidth>
                            <MenuItem value="Cap">
                                <FormattedMessage id="product.type.cap" defaultMessage="Cap" />
                            </MenuItem>
                            <MenuItem value="Shirt">
                                <FormattedMessage id="product.type.shirt" defaultMessage="Shirt" />
                            </MenuItem>
                            <MenuItem value="Tie">
                                <FormattedMessage id="product.type.tie" defaultMessage="Tie" />
                            </MenuItem>
                        </SelectField>
                        <SelectField
                            name="additionalTypes"
                            label={<FormattedMessage id="product.additionalTypes" defaultMessage="Additional Types" />}
                            required
                            fullWidth
                            multiple
                        >
                            <MenuItem value="Cap">
                                <FormattedMessage id="product.type.cap" defaultMessage="Cap" />
                            </MenuItem>
                            <MenuItem value="Shirt">
                                <FormattedMessage id="product.type.shirt" defaultMessage="Shirt" />
                            </MenuItem>
                            <MenuItem value="Tie">
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
                        />
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
}
