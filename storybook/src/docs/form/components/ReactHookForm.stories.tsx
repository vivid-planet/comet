import { gql, useApolloClient } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { RHFForm, RHFTextField, SaveBoundary, SaveBoundarySaveButton, SnackbarProvider } from "@comet/admin";
import { queryUpdatedAt, resolveHasSaveConflict, useSaveConflict } from "@comet/cms-admin";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

export default {
    title: "Docs/Form/Components/ReactHookForm",
};

interface FormValues {
    title: string | null;
    slug: string | null;
}

const productQuery = gql`
    query StoryProduct($id: ID!) {
        product(id: $id) {
            id
            updatedAt
            title
            slug
        }
    }
`;

const updateProductMutation = gql`
    mutation StoryUpdateProduct($id: ID!, $input: ProductUpdateInput!) {
        updateProduct(id: $id, input: $input) {
            id
            updatedAt
            title
            slug
        }
    }
`;

const createProductMutation = gql`
    mutation StoryCreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            product {
                id
                updatedAt
                title
                slug
            }
            errors {
                code
                field
            }
        }
    }
`;

const mockedProduct = {
    id: "1",
    updatedAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
    title: "Example Product",
    slug: "example-product",
};

const mocks: MockedResponse[] = [
    {
        request: {
            query: productQuery,
            variables: { id: "1" },
        },
        result: {
            data: {
                product: mockedProduct,
            },
        },
    },
    {
        request: {
            query: updateProductMutation,
            variables: {
                id: "1",
                input: {
                    title: "Updated Product",
                    slug: "updated-product",
                },
            },
        },
        result: {
            data: {
                updateProduct: {
                    ...mockedProduct,
                    title: "Updated Product",
                    slug: "updated-product",
                },
            },
        },
    },
    {
        request: {
            query: createProductMutation,
            variables: {
                input: {
                    title: "New Product",
                    slug: "new-product",
                },
            },
        },
        result: {
            data: {
                createProduct: {
                    product: {
                        id: "2",
                        updatedAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
                        title: "New Product",
                        slug: "new-product",
                    },
                    errors: [],
                },
            },
        },
    },
];

interface ProductFormProps {
    id?: string;
    onCreate?: (id: string) => void;
}

function ProductForm({ id, onCreate }: ProductFormProps) {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";

    const { data } = client.readQuery({ query: productQuery, variables: id ? { id } : undefined }) ?? {};

    const formValues: FormValues | undefined = data?.product
        ? {
              title: data.product.title,
              slug: data.product.slug,
          }
        : undefined;

    const form = useForm<FormValues>({
        defaultValues: {
            title: null,
            slug: null,
        },
        values: formValues,
        resetOptions: {
            keepDirtyValues: true,
        },
    });
    const { control } = form;

    const saveConflict = useSaveConflict({
        checkConflict: async () => {
            if (!id) return false;
            const updatedAt = await queryUpdatedAt(client, "product", id);
            return resolveHasSaveConflict(mockedProduct.updatedAt, updatedAt);
        },
        hasChanges: () => form.formState.isDirty,
        loadLatestVersion: async () => {
            if (!id) return;
            await client.query({ query: productQuery, variables: { id }, fetchPolicy: "network-only" });
        },
        onDiscardButtonPressed: async () => {
            form.reset();
            if (!id) return;
            await client.query({ query: productQuery, variables: { id }, fetchPolicy: "network-only" });
        },
    });

    const onSubmit = useCallback(
        async (formValues: FormValues) => {
            if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");

            if (mode === "edit") {
                if (!id) throw new Error();
                await client.mutate({
                    mutation: updateProductMutation,
                    variables: { id, input: formValues },
                });
            } else {
                const { data: mutationResponse } = await client.mutate({
                    mutation: createProductMutation,
                    variables: { input: formValues },
                });
                const newId = mutationResponse?.createProduct.product?.id;
                if (newId) {
                    setTimeout(() => {
                        onCreate?.(newId);
                    }, 0);
                }
            }
        },
        [client, id, mode, onCreate, saveConflict],
    );

    return (
        <RHFForm onSubmit={onSubmit} {...form}>
            {saveConflict.dialogs}
            <RHFTextField required fullWidth control={control} name="title" label={<FormattedMessage id="product.title" defaultMessage="Title" />} />
            <RHFTextField required fullWidth control={control} name="slug" label={<FormattedMessage id="product.slug" defaultMessage="Slug" />} />

            {/* TODO: Not yet implemented in RHF - will be added later */}
            {/*
            <TextAreaField fullWidth name="description" ... />
            <DateField required fullWidth name="availableSince" ... />
            <AsyncSelectField name="manufacturerCountry" ... />
            <AsyncSelectField name="manufacturer" ... />
            <SelectField name="type" ... />
            <SelectField name="additionalTypes" ... />
            <AsyncSelectField name="category" ... />
            <AsyncSelectField name="tags" ... />
            <CheckboxField name="inStock" ... />
            <Field name="image" ...>...</Field>
            <FileUploadField name="priceList" ... />
            <FileUploadField name="datasheets" ... />
            <DateTimeField name="lastCheckedAt" ... />
            */}
        </RHFForm>
    );
}

function StoryWithApollo({ id, onCreate }: ProductFormProps) {
    const client = useApolloClient();

    if (id) {
        // Preload data into Apollo cache
        client.writeQuery({
            query: productQuery,
            variables: { id },
            data: { product: mockedProduct },
        });
    }

    return <ProductForm id={id} onCreate={onCreate} />;
}

export const EditProductForm = {
    render: () => {
        return (
            <MockedProvider mocks={mocks}>
                <SnackbarProvider>
                    <SaveBoundary>
                        <SaveBoundarySaveButton />
                        <StoryWithApollo id="1" />
                    </SaveBoundary>
                </SnackbarProvider>
            </MockedProvider>
        );
    },
};

export const AddProductForm = {
    render: () => {
        return (
            <MockedProvider mocks={mocks}>
                <SnackbarProvider>
                    <SaveBoundary>
                        <SaveBoundarySaveButton />
                        <StoryWithApollo onCreate={(id) => window.alert(`Created product with id: ${id}`)} />
                    </SaveBoundary>
                </SnackbarProvider>
            </MockedProvider>
        );
    },
};
