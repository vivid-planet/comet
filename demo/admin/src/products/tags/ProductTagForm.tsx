import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    filterByDocument,
    FinalForm,
    FinalFormSaveSplitButton,
    FinalFormSubmitEvent,
    MainContent,
    TextField,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    ToolbarTitleItem,
    useFormApiRef,
    useStackApi,
    useStackSwitchApi,
} from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import { EditPageLayout, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { CircularProgress, IconButton } from "@mui/material";
import { FormApi } from "final-form";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
    createProductTagMutation,
    productTagCheckForChangesQuery,
    productTagFormFragment,
    productTagQuery,
    updateProductTagMutation,
} from "./ProductTagForm.gql";
import {
    GQLCheckForChangesProductTagQuery,
    GQLCheckForChangesProductTagQueryVariables,
    GQLProductTagFormCreateProductTagMutation,
    GQLProductTagFormCreateProductTagMutationVariables,
    GQLProductTagFormFragment,
    GQLProductTagFormUpdateProductTagMutation,
    GQLProductTagFormUpdateProductTagMutationVariables,
    GQLProductTagQuery,
    GQLProductTagQueryVariables,
} from "./ProductTagForm.gql.generated";

interface FormProps {
    id?: string;
}

type FormState = GQLProductTagFormFragment;

function ProductTagForm({ id }: FormProps): React.ReactElement {
    const stackApi = useStackApi();
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
              ...filterByDocument<GQLProductTagFormFragment>(productTagFormFragment, data.productTag),
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
                variables: { id, input: output, lastUpdatedAt: data?.productTag.updatedAt },
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
        return <FormattedMessage id="common.error" defaultMessage="An error has occured. Please try again at later" />;
    }

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <FinalForm<FormState> apiRef={formApiRef} onSubmit={handleSubmit} mode={mode} initialValues={initialValues} subscription={{}}>
            {() => (
                <EditPageLayout>
                    {saveConflict.dialogs}
                    <Toolbar>
                        <ToolbarItem>
                            <IconButton onClick={stackApi?.goBack}>
                                <ArrowLeft />
                            </IconButton>
                        </ToolbarItem>
                        <ToolbarTitleItem>
                            <Field name="title">
                                {({ input }) =>
                                    input.value ? (
                                        input.value
                                    ) : (
                                        <FormattedMessage id="products.productTagDetail" defaultMessage="Product Tag Detail" />
                                    )
                                }
                            </Field>
                        </ToolbarTitleItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <FinalFormSaveSplitButton hasConflict={saveConflict.hasConflict} />
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <TextField required fullWidth name="title" label={<FormattedMessage id="product.title" defaultMessage="Title" />} />
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}

export default ProductTagForm;
