import { useApolloClient, useQuery } from "@apollo/client";
import { filterByFragment, FinalForm, FinalFormSubmitEvent, MainContent, TextField, useFormApiRef, useStackSwitchApi } from "@comet/admin";
import { resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { CircularProgress } from "@mui/material";
import { FormApi } from "final-form";
import { FormattedMessage } from "react-intl";

import {
    createProductCategoryMutation,
    productCategoryCheckForChangesQuery,
    productCategoryFormFragment,
    productCategoryQuery,
    updateProductCategoryMutation,
} from "./ProductCategoryForm.gql";
import {
    GQLCheckForChangesProductCategoryQuery,
    GQLCheckForChangesProductCategoryQueryVariables,
    GQLProductCategoryFormCreateProductCategoryMutation,
    GQLProductCategoryFormCreateProductCategoryMutationVariables,
    GQLProductCategoryFormFragment,
    GQLProductCategoryFormUpdateProductCategoryMutation,
    GQLProductCategoryFormUpdateProductCategoryMutationVariables,
    GQLProductCategoryQuery,
    GQLProductCategoryQueryVariables,
} from "./ProductCategoryForm.gql.generated";

interface FormProps {
    id?: string;
}

type FormState = GQLProductCategoryFormFragment;

function ProductCategoryForm({ id }: FormProps) {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormState>();
    const stackSwitchApi = useStackSwitchApi();

    const { data, error, loading, refetch } = useQuery<GQLProductCategoryQuery, GQLProductCategoryQueryVariables>(
        productCategoryQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues: Partial<FormState> = data?.productCategory
        ? {
              ...filterByFragment<GQLProductCategoryFormFragment>(productCategoryFormFragment, data.productCategory),
          }
        : {};

    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            if (!id) return false;
            const { data: hasConflictData } = await client.query<
                GQLCheckForChangesProductCategoryQuery,
                GQLCheckForChangesProductCategoryQueryVariables
            >({
                query: productCategoryCheckForChangesQuery,
                variables: { id },
                fetchPolicy: "no-cache",
            });
            return resolveHasSaveConflict(data?.productCategory.updatedAt, hasConflictData.productCategory.updatedAt);
        },
        formApiRef,
        loadLatestVersion: async () => {
            await refetch();
        },
    });

    const handleSubmit = async (formState: FormState, form: FormApi<FormState>, event: FinalFormSubmitEvent) => {
        if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");
        const output = { ...formState };
        if (mode === "edit") {
            if (!id) throw new Error();
            await client.mutate<GQLProductCategoryFormUpdateProductCategoryMutation, GQLProductCategoryFormUpdateProductCategoryMutationVariables>({
                mutation: updateProductCategoryMutation,
                variables: { id, input: output },
            });
        } else {
            const { data: mutationResponse } = await client.mutate<
                GQLProductCategoryFormCreateProductCategoryMutation,
                GQLProductCategoryFormCreateProductCategoryMutationVariables
            >({
                mutation: createProductCategoryMutation,
                variables: { input: output },
            });
            if (!event.navigatingBack) {
                const id = mutationResponse?.createProductCategory.id;
                if (id) {
                    setTimeout(() => {
                        stackSwitchApi.activatePage(`edit`, id);
                    });
                }
            }
        }
    };

    if (error) {
        return <FormattedMessage id="common.error" defaultMessage="An error has occurred. Please try again at later" />;
    }

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <FinalForm<FormState> apiRef={formApiRef} onSubmit={handleSubmit} mode={mode} initialValues={initialValues} subscription={{}}>
            {() => (
                <>
                    {saveConflict.dialogs}
                    <MainContent>
                        <TextField required fullWidth name="title" label={<FormattedMessage id="product.title" defaultMessage="Title" />} />
                        <TextField required fullWidth name="slug" label={<FormattedMessage id="product.slug" defaultMessage="Slug" />} />
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
}

export default ProductCategoryForm;
