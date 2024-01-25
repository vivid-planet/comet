import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormInput,
    FinalFormSaveButton,
    FinalFormSubmitEvent,
    MainContent,
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
import { filter } from "graphql-anywhere";
import React from "react";
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

function ProductCategoryForm({ id }: FormProps): React.ReactElement {
    const stackApi = useStackApi();
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
              ...filter<GQLProductCategoryFormFragment>(productCategoryFormFragment, data.productCategory),
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
        const output = {
            ...formState,
            products: [], // TODO don't reset on update
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            await client.mutate<GQLProductCategoryFormUpdateProductCategoryMutation, GQLProductCategoryFormUpdateProductCategoryMutationVariables>({
                mutation: updateProductCategoryMutation,
                variables: { id, input: output, lastUpdatedAt: data?.productCategory.updatedAt },
            });
        } else {
            const { data: mutationReponse } = await client.mutate<
                GQLProductCategoryFormCreateProductCategoryMutation,
                GQLProductCategoryFormCreateProductCategoryMutationVariables
            >({
                mutation: createProductCategoryMutation,
                variables: { input: output },
            });
            if (!event.navigatingBack) {
                const id = mutationReponse?.createProductCategory.id;
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
                                        <FormattedMessage id="products.productCategoryDetail" defaultMessage="Product Category Detail" />
                                    )
                                }
                            </Field>
                        </ToolbarTitleItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <FinalFormSaveButton hasConflict={saveConflict.hasConflict} />
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <Field
                            required
                            fullWidth
                            name="title"
                            component={FinalFormInput}
                            label={<FormattedMessage id="product.title" defaultMessage="Title" />}
                        />
                        <Field
                            required
                            fullWidth
                            name="slug"
                            component={FinalFormInput}
                            label={<FormattedMessage id="product.slug" defaultMessage="Slug" />}
                        />
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}

export default ProductCategoryForm;
