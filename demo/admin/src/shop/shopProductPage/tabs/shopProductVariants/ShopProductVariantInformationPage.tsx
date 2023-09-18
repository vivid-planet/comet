import { useApolloClient, useQuery } from "@apollo/client";
import { Field, FinalForm, FinalFormInput, MainContent, useStackApi } from "@comet/admin";
import { EditPageLayout } from "@comet/cms-admin";
import { Card, CardContent } from "@mui/material";
import { GQLMutationcreateShopProductVariantArgs, GQLMutationupdateShopProductVariantArgs, GQLShopProductVariantInput } from "@src/graphql.generated";
import {
    GQLShopProductVariantQuery,
    GQLShopProductVariantQueryVariables,
} from "@src/shop/shopProductPage/tabs/shopProductVariants/ShopProductVariantInformationPage.generated";
import { ShopProductVariantToolbar } from "@src/shop/shopProductPage/tabs/shopProductVariants/ShopProductVariantToolbar";
import gql from "graphql-tag";
import React from "react";
import { useIntl } from "react-intl";

export const ShopProductVariantInformationPage: React.FunctionComponent<{ shopProductVariantId: string; shopProductId: string }> = ({
    shopProductVariantId,
    shopProductId,
}) => {
    const intl = useIntl();
    const stackApi = useStackApi();
    const client = useApolloClient();
    const { data } = useQuery<GQLShopProductVariantQuery, GQLShopProductVariantQueryVariables>(shopProductVariantQuery, {
        variables: { id: shopProductVariantId },
        skip: shopProductVariantId === "new",
    });
    const handleSubmit = async (input: GQLShopProductVariantInput) => {
        input.price = Number(input.price);
        if (data?.shopProductVariant) {
            return client.mutate<GQLMutationupdateShopProductVariantArgs>({
                mutation: updateShopProductVariantMutation,
                variables: { id: shopProductVariantId, input },
            });
        } else {
            return client.mutate<GQLMutationcreateShopProductVariantArgs>({
                mutation: createShopProductVariantMutation,
                variables: { input },
            });
        }
    };

    return (
        <FinalForm<GQLShopProductVariantInput>
            onSubmit={handleSubmit}
            mode={shopProductVariantId ? "edit" : "add"}
            initialValues={
                data?.shopProductVariant
                    ? {
                          name: data.shopProductVariant.name,
                          size: data.shopProductVariant.size,
                          color: data.shopProductVariant.color,
                          price: data.shopProductVariant.price,
                          product: shopProductId,
                      }
                    : {
                          name: "Product Name",
                          size: "Product Size",
                          color: "Product Color",
                          price: 0,
                          product: shopProductId,
                      }
            }
            renderButtons={() => null}
            onAfterSubmit={(values, form) => {
                form.reset(values);
            }}
        >
            {({ values, pristine, hasValidationErrors, submitting, handleSubmit, hasSubmitErrors, form }) => {
                return (
                    <>
                        <ShopProductVariantToolbar variantName={data?.shopProductVariant.name} stackApi={stackApi} />
                        <EditPageLayout>
                            <MainContent>
                                <Card>
                                    <CardContent>
                                        <Field
                                            type="text"
                                            name="name"
                                            fullWidth
                                            label={intl.formatMessage({ id: "shopProduct.variant.finalForm.name", defaultMessage: "Name" })}
                                            component={FinalFormInput}
                                            required
                                        />
                                        <Field
                                            type="text"
                                            name="size"
                                            fullWidth
                                            label={intl.formatMessage({ id: "shopProduct.variant.finalForm.size", defaultMessage: "Size" })}
                                            component={FinalFormInput}
                                            required
                                        />
                                        <Field
                                            type="text"
                                            name="color"
                                            fullWidth
                                            label={intl.formatMessage({ id: "shopProduct.variant.finalForm.color", defaultMessage: "Color" })}
                                            component={FinalFormInput}
                                            required
                                        />
                                        <Field
                                            type="number"
                                            name="price"
                                            fullWidth
                                            label={intl.formatMessage({ id: "shopProduct.variant.finalForm.price", defaultMessage: "Price" })}
                                            component={FinalFormInput}
                                            required
                                            validate={(value) => {
                                                if (value < 0) {
                                                    return intl.formatMessage({
                                                        id: "shopProduct.variant.finalForm.price.validation",
                                                        defaultMessage: "Price must be greater than 0",
                                                    });
                                                }
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </MainContent>
                        </EditPageLayout>
                    </>
                );
            }}
        </FinalForm>
    );
};

const shopProductVariantQuery = gql`
    query ShopProductVariant($id: ID!) {
        shopProductVariant(id: $id) {
            id
            name
            size
            color
            price
        }
    }
`;

export const updateShopProductVariantMutation = gql`
    mutation UpdateShopProductVariant($id: ID!, $input: ShopProductVariantUpdateInput!) {
        updateShopProductVariant(id: $id, input: $input) {
            id
        }
    }
`;

export const createShopProductVariantMutation = gql`
    mutation CreateShopProductVariant($input: ShopProductVariantInput!) {
        createShopProductVariant(input: $input) {
            id
        }
    }
`;
