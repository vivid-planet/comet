import { useApolloClient, useQuery } from "@apollo/client";
import { filterByFragment, FinalForm, type FinalFormSubmitEvent, MainContent, TextField, useFormApiRef, useStackSwitchApi } from "@comet/admin";
import { resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { CircularProgress } from "@mui/material";
import { type FormApi } from "final-form";
import { FormattedMessage } from "react-intl";

import {
    createProductTagMutation,
    productTagCheckForChangesQuery,
    productTagFormFragment,
    productTagQuery,
    updateProductTagMutation,
} from "./ProductTagForm.gql";
import {
    type GQLCheckForChangesProductTagQuery,
    type GQLCheckForChangesProductTagQueryVariables,
    type GQLProductTagFormCreateProductTagMutation,
    type GQLProductTagFormCreateProductTagMutationVariables,
    type GQLProductTagFormFragment,
    type GQLProductTagFormUpdateProductTagMutation,
    type GQLProductTagFormUpdateProductTagMutationVariables,
    type GQLProductTagQuery,
    type GQLProductTagQueryVariables,
} from "./ProductTagForm.gql.generated";

interface FormProps {
    id?: string;
}

type FormState = GQLProductTagFormFragment;

function ProductTagForm({ id }: FormProps) {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormState>();
    const stackSwitchApi = useStackSwitchApi();

    const { data, error, loading, refetch } = useQuery<GQLProductTagQuery, GQLProductTagQueryVariables>(
        productTagQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues: Partial<FormState> = data?.productTag
        ? {
              ...filterByFragment<GQLProductTagFormFragment>(productTagFormFragment, data.productTag),
          }
        : {};

    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            if (!id) return false;
            const { data: hasConflictData } = await client.query<GQLCheckForChangesProductTagQuery, GQLCheckForChangesProductTagQueryVariables>({
                query: productTagCheckForChangesQuery,
                variables: { id },
                fetchPolicy: "no-cache",
            });
            return resolveHasSaveConflict(data?.productTag.updatedAt, hasConflictData.productTag.updatedAt);
        },
        formApiRef,
        loadLatestVersion: async () => {
            await refetch();
        },
    });

    const handleSubmit = async (formState: FormState, form: FormApi<FormState>, event: FinalFormSubmitEvent) => {
        if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");
        const output = {
            ...formState,
            products: [], // TODO don't reset on update
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            await client.mutate<GQLProductTagFormUpdateProductTagMutation, GQLProductTagFormUpdateProductTagMutationVariables>({
                mutation: updateProductTagMutation,
                variables: { id, input: output },
            });
        } else {
            const { data: mutationResponse } = await client.mutate<
                GQLProductTagFormCreateProductTagMutation,
                GQLProductTagFormCreateProductTagMutationVariables
            >({
                mutation: createProductTagMutation,
                variables: { input: output },
            });
            if (!event.navigatingBack) {
                const id = mutationResponse?.createProductTag.id;
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
                    </MainContent>
                </>
            )}
        </FinalForm>
    );
}

export default ProductTagForm;
