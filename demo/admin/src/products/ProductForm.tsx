import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FinalForm,
    FinalFormCheckbox,
    FinalFormInput,
    FinalFormSaveSplitButton,
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
import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
import { DamImageBlock, EditPageLayout, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { CircularProgress, FormControlLabel, IconButton } from "@mui/material";
import {
    GQLCheckForChangesProductQuery,
    GQLCheckForChangesProductQueryVariables,
    GQLProductFormCreateProductMutation,
    GQLProductFormCreateProductMutationVariables,
    GQLProductFormFragment,
    GQLProductFormUpdateProductMutation,
    GQLProductFormUpdateProductMutationVariables,
    GQLProductQuery,
    GQLProductQueryVariables,
} from "@src/graphql.generated";
import { filter } from "graphql-anywhere";
import isEqual from "lodash.isequal";
import React from "react";
import { FormattedMessage } from "react-intl";

import { createProductMutation, productCheckForChangesQuery, productFormFragment, productQuery, updateProductMutation } from "./ProductForm.gql";

interface FormProps {
    id?: string;
}

const rootBlocks = {
    image: DamImageBlock,
};

type FormState = Omit<GQLProductFormFragment, "price"> & {
    price: string;
    image: BlockState<typeof rootBlocks.image>;
};

function ProductForm({ id }: FormProps): React.ReactElement {
    const stackApi = useStackApi();
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormState>();
    const stackSwitchApi = useStackSwitchApi();
    const createMutationResponseRef = React.useRef<GQLProductFormCreateProductMutation>();

    const { data, error, loading, refetch } = useQuery<GQLProductQuery, GQLProductQueryVariables>(
        productQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues: Partial<FormState> = data?.product
        ? {
              ...filter<GQLProductFormFragment>(productFormFragment, data.product),
              price: String(data.product.price),
              image: rootBlocks.image.input2State(data.product.image),
          }
        : {
              image: rootBlocks.image.defaultValues(),
          };

    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            if (!id) return false;
            const { data: hasConflictData } = await client.query<GQLCheckForChangesProductQuery, GQLCheckForChangesProductQueryVariables>({
                query: productCheckForChangesQuery,
                variables: { id },
                fetchPolicy: "no-cache",
            });
            return resolveHasSaveConflict(data?.product.updatedAt, hasConflictData.product.updatedAt);
        },
        formApiRef,
        loadLatestVersion: async () => {
            await refetch();
        },
    });

    const handleSubmit = async (formState: FormState) => {
        if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");
        createMutationResponseRef.current = undefined;
        const output = {
            ...formState,
            price: parseFloat(formState.price),
            image: rootBlocks.image.state2Output(formState.image),
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            await client.mutate<GQLProductFormUpdateProductMutation, GQLProductFormUpdateProductMutationVariables>({
                mutation: updateProductMutation,
                variables: { id, input: output, lastUpdatedAt: data?.product.updatedAt },
            });
        } else {
            const { data: mutationReponse } = await client.mutate<GQLProductFormCreateProductMutation, GQLProductFormCreateProductMutationVariables>({
                mutation: createProductMutation,
                variables: { input: output },
            });
            if (mutationReponse) {
                createMutationResponseRef.current = mutationReponse;
            }
        }
    };

    if (error) {
        return <FormattedMessage id="demo.common.error" defaultMessage="Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal." />;
    }

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <FinalForm<FormState>
            apiRef={formApiRef}
            onSubmit={handleSubmit}
            mode={mode}
            initialValues={initialValues}
            initialValuesEqual={isEqual} //required to compare block data correctly
            onAfterSubmit={(values, form) => {
                //don't go back automatically
            }}
        >
            {({ values }) => (
                <EditPageLayout>
                    {saveConflict.dialogs}
                    <Toolbar>
                        <ToolbarItem>
                            <IconButton onClick={stackApi?.goBack}>
                                <ArrowLeft />
                            </IconButton>
                        </ToolbarItem>
                        <ToolbarTitleItem>
                            {values.title ? values.title : <FormattedMessage id="comet.products.productDetail" defaultMessage="Product Detail" />}
                        </ToolbarTitleItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <FinalFormSaveSplitButton
                                onNavigateToEditPage={() => {
                                    const id = createMutationResponseRef.current?.createProduct.id;
                                    if (mode == "add" && id) {
                                        stackSwitchApi.activatePage(`edit`, id);
                                    }
                                }}
                            />
                        </ToolbarActions>
                    </Toolbar>
                    <MainContent>
                        <Field
                            required
                            fullWidth
                            name="title"
                            component={FinalFormInput}
                            label={<FormattedMessage id="demo.product.title" defaultMessage="Titel" />}
                        />
                        <Field
                            required
                            fullWidth
                            name="slug"
                            component={FinalFormInput}
                            label={<FormattedMessage id="demo.product.slug" defaultMessage="Slug" />}
                        />
                        <Field
                            required
                            fullWidth
                            multiline
                            rows={5}
                            name="description"
                            component={FinalFormInput}
                            label={<FormattedMessage id="demo.product.description" defaultMessage="Beschreibung" />}
                        />
                        <Field
                            fullWidth
                            name="price"
                            component={FinalFormInput}
                            inputProps={{ type: "number" }}
                            label={<FormattedMessage id="demo.product.price" defaultMessage="Preis" />}
                        />
                        <Field name="inStock" label="" type="checkbox" fullWidth>
                            {(props) => (
                                <FormControlLabel
                                    label={<FormattedMessage id="demo.product.inStock" defaultMessage="Auf Lager" />}
                                    control={<FinalFormCheckbox {...props} />}
                                />
                            )}
                        </Field>
                        <Field name="image" isEqual={isEqual}>
                            {createFinalFormBlock(rootBlocks.image)}
                        </Field>
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}

export default ProductForm;
