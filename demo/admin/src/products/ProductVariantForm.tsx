import { useApolloClient, useQuery } from "@apollo/client";
import { Field, FinalForm, FinalFormInput, FinalFormSubmitEvent, Loading, MainContent, useFormApiRef, useStackSwitchApi } from "@comet/admin";
import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
import { DamImageBlock, EditPageLayout, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { FormApi } from "final-form";
import { filter } from "graphql-anywhere";
import isEqual from "lodash.isequal";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
    createProductVariantFormMutation,
    productVariantFormFragment,
    productVariantFormQuery,
    updateProductVariantFormMutation,
} from "./ProductVariantForm.gql";
import {
    GQLCreateProductVariantMutation,
    GQLCreateProductVariantMutationVariables,
    GQLProductVariantFormFragment,
    GQLProductVariantFormQuery,
    GQLProductVariantFormQueryVariables,
    GQLUpdateProductVariantMutation,
    GQLUpdateProductVariantMutationVariables,
} from "./ProductVariantForm.gql.generated";

interface FormProps {
    id?: string;
    productId: string;
}

const rootBlocks = {
    image: DamImageBlock,
};

type FormValues = Omit<GQLProductVariantFormFragment, "image"> & {
    image: BlockState<typeof rootBlocks.image>;
};

export function ProductVariantForm({ id, productId }: FormProps): React.ReactElement {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();

    const { data, error, loading, refetch } = useQuery<GQLProductVariantFormQuery, GQLProductVariantFormQueryVariables>(
        productVariantFormQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues: Partial<FormValues> = data?.productVariant
        ? {
              ...filter<GQLProductVariantFormFragment>(productVariantFormFragment, data.productVariant),
              image: rootBlocks.image.input2State(data.productVariant.image),
          }
        : {
              image: rootBlocks.image.defaultValues(),
          };

    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            const updatedAt = await queryUpdatedAt(client, "productVariant", id);
            return resolveHasSaveConflict(data?.productVariant.updatedAt, updatedAt);
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
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            await client.mutate<GQLUpdateProductVariantMutation, GQLUpdateProductVariantMutationVariables>({
                mutation: updateProductVariantFormMutation,
                variables: { id, input: output },
            });
        } else {
            const { data: mutationReponse } = await client.mutate<GQLCreateProductVariantMutation, GQLCreateProductVariantMutationVariables>({
                mutation: createProductVariantFormMutation,
                variables: { product: productId, input: output },
            });
            if (!event.navigatingBack) {
                const id = mutationReponse?.createProductVariant.id;
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
            mode="edit"
            initialValues={initialValues}
            initialValuesEqual={isEqual} //required to compare block data correctly
            subscription={{}}
        >
            {() => (
                <EditPageLayout>
                    {saveConflict.dialogs}
                    <MainContent>
                        <Field
                            fullWidth
                            name="name"
                            component={FinalFormInput}
                            label={<FormattedMessage id="productVariant.name" defaultMessage="Name" />}
                        />
                        <Field name="image" isEqual={isEqual}>
                            {createFinalFormBlock(rootBlocks.image)}
                        </Field>
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}
