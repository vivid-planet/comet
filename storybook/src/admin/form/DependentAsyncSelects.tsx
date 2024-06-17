import { gql, useApolloClient } from "@apollo/client";
import { AsyncSelectField, FinalForm } from "@comet/admin";
import { Box } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Field, FieldRenderProps } from "react-final-form";

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
                            <OnChange name="manufacturer">
                                {() => {
                                    console.log("Custom OnChange");
                                    form.change("product", undefined);
                                    return null;
                                }}
                            </OnChange>
                            <Field name="manufacturer" subscription={{ value: true, dirty: true }}>
                                {() => {
                                    console.log("Field change");
                                    form.change("product", undefined);
                                    return null;
                                }}
                            </Field>
                        </>
                    )}
                </FinalForm>
            </Box>
        );
    });

type Props = { name: string; children: (value: any, previous: any) => void };

function OnChange({ name, children }: Props) {
    return <Field name={name}>{({ input }) => <InnerOnChange input={input}>{children}</InnerOnChange>}</Field>;
}

function InnerOnChange({ input, children }: Pick<FieldRenderProps<any>, "input"> & Pick<Props, "children">) {
    const previousValue = React.useRef(input.value);

    React.useEffect(() => {
        if (input.value !== previousValue.current) {
            children(input.value, previousValue.current);
            previousValue.current = input.value;
        }
    }, [input.value, children]);

    return null;
}
