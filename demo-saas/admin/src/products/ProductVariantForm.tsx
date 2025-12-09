import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    filterByFragment,
    FinalForm,
    FinalFormInput,
    type FinalFormSubmitEvent,
    Loading,
    useFormApiRef,
    useStackSwitchApi,
} from "@comet/admin";
import { FileUploadField, type GQLFinalFormFileUploadFragment, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { type FormApi } from "final-form";
import isEqual from "lodash.isequal";
import { FormattedMessage } from "react-intl";

import {
    createProductVariantFormMutation,
    productVariantFormFragment,
    productVariantFormQuery,
    updateProductVariantFormMutation,
} from "./ProductVariantForm.gql";
import {
    type GQLCreateProductVariantMutation,
    type GQLCreateProductVariantMutationVariables,
    type GQLProductVariantFormManualFragment,
    type GQLProductVariantFormQuery,
    type GQLProductVariantFormQueryVariables,
    type GQLUpdateProductVariantMutation,
    type GQLUpdateProductVariantMutationVariables,
} from "./ProductVariantForm.gql.generated";

interface FormProps {
    id?: string;
    productId: string;
}

// Set types for FinalFormFileUpload manually, as they cannot be generated from the fragment in `@comet/cms-admin`
type ProductVariantFormManualFragment = Omit<GQLProductVariantFormManualFragment, "image"> & {
    image: GQLFinalFormFileUploadFragment | null;
};

type FormValues = ProductVariantFormManualFragment;

export function ProductVariantForm({ id, productId }: FormProps) {
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
              ...filterByFragment<ProductVariantFormManualFragment>(productVariantFormFragment, data.productVariant),
          }
        : {};

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
            image: formValues.image ? formValues.image.id : null,
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
                <>
                    {saveConflict.dialogs}
                    <Field
                        required
                        fullWidth
                        name="name"
                        component={FinalFormInput}
                        label={<FormattedMessage id="productVariant.name" defaultMessage="Name" />}
                    />
                    <FileUploadField
                        label={<FormattedMessage id="product.image" defaultMessage="Image" />}
                        name="image"
                        maxFileSize={1024 * 1024 * 4} // 4 MB
                        fullWidth
                    />
                </>
            )}
        </FinalForm>
    );
}
