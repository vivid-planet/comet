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
    SelectField,
    TextAreaField,
    TextField,
    useFormApiRef,
    useStackSwitchApi,
} from "@comet/admin";
import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
import { DamImageBlock, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { MenuItem } from "@mui/material";
import { GQLProductType } from "@src/graphql.generated";
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
}

const rootBlocks = {
    image: DamImageBlock,
};

type FormValues = Omit<GQLProductFormManualFragment, "image"> & {
    image: BlockState<typeof rootBlocks.image>;
};

export function ProductForm({ id }: FormProps): React.ReactElement {
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
              ...filterByFragment<GQLProductFormManualFragment>(productFormFragment, data.product),
              image: rootBlocks.image.input2State(data.product.image),
          }
        : {
              image: rootBlocks.image.defaultValues(),
              inStock: false,
              additionalTypes: [],
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
                        <SelectField name="type" label="Type" required fullWidth>
                            <MenuItem value="Cap">Cap</MenuItem>
                            <MenuItem value="Shirt">Shirt</MenuItem>
                            <MenuItem value="Tie">Tie</MenuItem>
                        </SelectField>
                        <SelectField name="additionalTypes" label="Additional Type" required fullWidth multiple>
                            <MenuItem value="Cap">Cap</MenuItem>
                            <MenuItem value="Shirt">Shirt</MenuItem>
                            <MenuItem value="Tie">Tie</MenuItem>
                        </SelectField>
                        <AsyncSelectField
                            fullWidth
                            name="category"
                            label="Category"
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
                            label="Tags"
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
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
}
