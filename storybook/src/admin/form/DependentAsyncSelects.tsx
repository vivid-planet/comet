import { gql, useApolloClient } from "@apollo/client";
import { AsyncSelectField, FinalForm, OnChangeField } from "@comet/admin";
import { Box } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
import { Manufacturer, Product } from "../../mocks/handlers";

interface FormValues {
    manufacturer?: Manufacturer;
    product?: Product;
}

storiesOf("@comet/admin/form", module)
    .addDecorator(apolloStoryDecorator("/graphql"))
    .add("Dependent async selects", function () {
        const client = useApolloClient();

        return (
            <Box maxWidth={400}>
                <FinalForm<FormValues>
                    mode="add"
                    onSubmit={() => {
                        // Noop
                    }}
                >
                    {({ values, form }) => (
                        <>
                            <AsyncSelectField
                                name="manufacturer"
                                loadOptions={async () => {
                                    const { data } = await client.query({
                                        query: gql`
                                            query Manufacturers {
                                                manufacturers {
                                                    id
                                                    name
                                                }
                                            }
                                        `,
                                    });

                                    return data.manufacturers;
                                }}
                                getOptionLabel={(option: Manufacturer) => option.name}
                                label="Manufacturer"
                                fullWidth
                            />
                            <AsyncSelectField
                                name="product"
                                loadOptions={async () => {
                                    const { data } = await client.query({
                                        query: gql`
                                            query Products($manufacturer: ID) {
                                                products(manufacturer: $manufacturer) {
                                                    id
                                                    name
                                                }
                                            }
                                        `,
                                        variables: { manufacturer: values.manufacturer?.id },
                                    });

                                    return data.products;
                                }}
                                getOptionLabel={(option: Product) => option.name}
                                label="Product"
                                fullWidth
                                disabled={!values.manufacturer}
                            />
                            <OnChangeField name="manufacturer">
                                {() => {
                                    form.change("product", undefined);
                                }}
                            </OnChangeField>
                        </>
                    )}
                </FinalForm>
            </Box>
        );
    });
