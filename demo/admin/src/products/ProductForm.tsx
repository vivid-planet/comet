import { useApolloClient, useQuery } from "@apollo/client";
import { filterByFragment, Loading, RHFForm, RHFTextField } from "@comet/admin";
import { DamImageBlock, queryUpdatedAt, resolveHasSaveConflict, useSaveConflict } from "@comet/cms-admin";
import { type GQLProductInput, type GQLProductMutationErrorCode } from "@src/graphql.generated";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { defineMessage, FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

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

const rootBlocks = {
    image: DamImageBlock,
};

interface FormProps {
    id?: string;
    onCreate?: (id: string) => void;
}

const submissionErrorMessages: { [K in GQLProductMutationErrorCode]: MessageDescriptor } = {
    titleTooShort: defineMessage({
        id: "product.form.error.titleTooShort",
        defaultMessage: "Title must be at least 3 characters long when creating a product, except for foo",
    }),
};

type FormValues = GQLProductFormManualFragment;

export function ProductForm({ id, onCreate }: FormProps) {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";

    const { data, error, loading, refetch } = useQuery<GQLProductQuery, GQLProductQueryVariables>(
        productQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues: FormValues = useMemo(() => {
        if (!data) {
            return { title: "", slug: "" };
        }
        const filteredData = filterByFragment<GQLProductFormManualFragment>(productFormFragment, data.product);
        return {
            ...filteredData,
        };
    }, [data]);

    const form = useForm<FormValues>({
        mode: "onBlur",
        values: initialValues,
        resetOptions: {
            keepDirtyValues: true,
        },
    });
    const intl = useIntl();
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
        async ({ ...formValues }: FormValues) => {
            if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");

            const output: GQLProductInput = {
                ...formValues,
                type: "cap",
                image: rootBlocks.image.state2Output(rootBlocks.image.defaultValues()),
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
                            setError(error.field as keyof FormValues, { message: intl.formatMessage(errorMessage) });
                        } else {
                            setError("root", { message: intl.formatMessage(errorMessage) });
                        }
                    });
                    throw new Error("Submit errors");
                }
                const newId = mutationResponse?.createProduct.product?.id;
                if (newId) {
                    form.reset(initialValues, { keepDirtyValues: false });
                    setTimeout(() => {
                        onCreate?.(newId);
                    }, 0);
                }
            }
        },
        [client, id, intl, mode, onCreate, saveConflict, setError, form, initialValues],
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
        </RHFForm>
    );
}
