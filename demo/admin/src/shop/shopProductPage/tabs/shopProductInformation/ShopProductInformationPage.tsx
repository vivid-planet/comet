import { useApolloClient, useQuery } from "@apollo/client";
import { Field, FinalForm, FinalFormInput, FormSection, MainContent } from "@comet/admin";
import { EditPageLayout } from "@comet/cms-admin";
import { Card, CardContent } from "@mui/material";
import { GQLMutationcreateProductArgs, GQLMutationupdateShopProductArgs, GQLShopProductInput } from "@src/graphql.generated";
import { useSaveShopProductHandler } from "@src/shop/shopProductPage/SaveShopProductHandler";
import {
    GQLShopProductQuery,
    GQLShopProductQueryVariables,
} from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesPage.generated";
import gql from "graphql-tag";
import React from "react";
import { useIntl } from "react-intl";

export const ShopProductInformationPage: React.FunctionComponent<{ shopProductId: string }> = ({ shopProductId }) => {
    const { registerHandleSubmit } = useSaveShopProductHandler();
    const intl = useIntl();
    const client = useApolloClient();
    const { data } = useQuery<GQLShopProductQuery, GQLShopProductQueryVariables>(shopProductQuery, {
        variables: { id: shopProductId },
        skip: shopProductId === "new",
    });
    const handleSubmit = async (input: GQLShopProductInput) => {
        if (data?.shopProduct) {
            return client.mutate<GQLMutationupdateShopProductArgs>({
                mutation: updateShopProductMutation,
                variables: { id: shopProductId, input },
            });
        } else {
            return client.mutate<GQLMutationcreateProductArgs>({
                mutation: createShopProductMutation,
                variables: { input },
            });
        }
    };

    return (
        <FinalForm<GQLShopProductInput>
            onSubmit={handleSubmit}
            mode={shopProductId ? "edit" : "add"}
            initialValues={
                data?.shopProduct
                    ? { name: data.shopProduct.name, description: data.shopProduct.description }
                    : { name: "Product Name", description: "This should be the product description" }
            }
            renderButtons={() => null}
            onAfterSubmit={(values, form) => {
                form.reset(values);
            }}
        >
            {({ values, pristine, hasValidationErrors, submitting, handleSubmit, hasSubmitErrors, form }) => {
                registerHandleSubmit(handleSubmit);
                return (
                    <EditPageLayout>
                        <MainContent disablePadding>
                            <Card>
                                <CardContent>
                                    <FormSection title="Product information" disableMarginBottom>
                                        <Field
                                            type="text"
                                            name="name"
                                            fullWidth
                                            label={intl.formatMessage({ id: "shopProductInformation.finalForm.name", defaultMessage: "Name" })}
                                            component={FinalFormInput}
                                            required
                                        />
                                        <Field
                                            type="text"
                                            name="description"
                                            fullWidth
                                            label={intl.formatMessage({
                                                id: "shopProductInformation.finalForm.description",
                                                defaultMessage: "Description",
                                            })}
                                            component={FinalFormInput}
                                            required
                                        />
                                    </FormSection>
                                </CardContent>
                            </Card>
                        </MainContent>
                    </EditPageLayout>
                );
            }}
        </FinalForm>
    );
};

const shopProductQuery = gql`
    query ShopProducts($id: ID!) {
        shopProduct(id: $id) {
            id
            name
            description
        }
    }
`;

export const updateShopProductMutation = gql`
    mutation UpdateShopProduct($id: ID!, $input: ShopProductUpdateInput!) {
        updateShopProduct(id: $id, input: $input) {
            id
        }
    }
`;

export const createShopProductMutation = gql`
    mutation CreateShopProduct($input: ShopProductInput!) {
        createShopProduct(input: $input) {
            id
        }
    }
`;
