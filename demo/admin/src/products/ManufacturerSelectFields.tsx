import { gql, useApolloClient } from "@apollo/client";
import { Field, FinalFormSelect, useAsyncOptionsProps, useFormApiRef } from "@comet/admin";
import { GQLManufacturerCountryFilter } from "@src/graphql.generated";
import {
    GQLManufacturerCountriesQuery,
    GQLManufacturerCountriesQueryVariables,
    GQLManufacturerCountrySelectFragment,
    GQLManufacturerSelectFragment,
    GQLManufacturersOptionsFragment,
    GQLProductManufacturersQuery,
    GQLProductManufacturersQueryVariables,
} from "@src/products/ManufacturerSelectFields.generated";
import React from "react";
import { FieldRenderProps, Form, FormSpy } from "react-final-form";
import { FormattedMessage } from "react-intl";

export const manufacturerCountrySelectFragment = gql`
    fragment ManufacturerCountrySelect on ManufacturerCountry {
        country
        used
    }
`;

export const manufacturerCountriesQuery = gql`
    query ManufacturerCountries($filter: ManufacturerCountryFilter) {
        manufacturerCountries(filter: $filter) {
            nodes {
                ...ManufacturerCountrySelect
            }
        }
    }
    ${manufacturerCountrySelectFragment}
`;

export const manufacturerSelectFragment = gql`
    fragment ManufacturerSelect on Product {
        manufacturer {
            id
            updatedAt
            address {
                country
            }
        }
    }
`;
export const manufacturersOptionsFragment = gql`
    fragment ManufacturersOptions on Manufacturer {
        id
        updatedAt
    }
`;
export const productManufacturersQuery = gql`
    query ProductManufacturers($filter: ManufacturerFilter) {
        manufacturers(filter: $filter) {
            nodes {
                ...ManufacturersOptions
                id
                updatedAt
                address {
                    country
                }
            }
        }
    }
    ${manufacturersOptionsFragment}
`;

type FormProps = { data?: GQLManufacturerSelectFragment; countrySelectFilter?: GQLManufacturerCountryFilter } & FieldRenderProps<string>;
type FormValues = {
    // this type should be much simpler. why does FinalFormSelect return everything of the selected object and not only the ID?
    // this type is defined to match values written by fields
    manufacturer?: {
        id: string;
        updatedAt: string;
        address: {
            country: string;
        };
    };
    country?: { id: string; used?: number };
};

/* KNOWN ISSUES:
    + data returned from async-select does contain too much irrelevant information
    + opening select-options of country triggers rerender of ManufacturerSelectFields-Component
    + formspy childrender seems to be called when opening select-options of country
    + formspy onChange seems to be called when opening select-options of country
 */

// TODO consider handling gqlArgs forwarded from outside of form
export function ManufacturerSelectFields({ input, data, countrySelectFilter }: FormProps): React.ReactElement {
    const client = useApolloClient();
    const mode = input.value ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const initialValues: Partial<FormValues> = data
        ? {
              manufacturer:
                  data.manufacturer && data.manufacturer.address
                      ? {
                            id: data.manufacturer.id,
                            updatedAt: data.manufacturer.updatedAt,
                            address: {
                                country: data.manufacturer.address.country,
                            },
                        }
                      : undefined,
              country: data.manufacturer && data.manufacturer.address ? { id: data.manufacturer.address.country } : undefined,
          }
        : {}; // is already filtered in form
    console.log("Initial Values: ", initialValues);

    const manufacturerCountrySelectAsyncProps = useAsyncOptionsProps(async () => {
        const countries = await client.query<GQLManufacturerCountriesQuery, GQLManufacturerCountriesQueryVariables>({
            query: manufacturerCountriesQuery,
            variables: {
                filter: countrySelectFilter,
            },
        });
        return countries.data.manufacturerCountries.nodes.map((country) => {
            // identifying field is named country and not id or value so matching does not work smooth
            return {
                id: country.country,
                used: country.used,
            };
        });
    });

    return (
        <>
            <input type="hidden" {...input} />
            <Form<FormValues>
                apiRef={formApiRef}
                onSubmit={() => {
                    // do nothing
                }}
                mode={mode}
                initialValues={initialValues}
                subscription={{}}
                render={({ form, values }) => (
                    // using render function to prevent form-tag in form-tag
                    <div>
                        <Field
                            fullWidth
                            name="country"
                            label="Country"
                            component={FinalFormSelect}
                            {...manufacturerCountrySelectAsyncProps}
                            getOptionLabel={(option: GQLManufacturerCountrySelectFragment) =>
                                `${option.id}${option.used ? ` (available: ${option.used})` : ``}`
                            }
                        />

                        <FormSpy<FormValues>
                            onChange={(formState) => {
                                // send changes of ManufacturerSelect to outer form
                                console.log("ManufacturerSelectFields > FormSpy > forward-change", formState);
                                if (formState.dirtyFields["manufacturer"]) {
                                    console.log(
                                        "ManufacturerSelectFields > FormSpy > forward-change -> call onChange",
                                        formState.values.manufacturer?.id,
                                    );
                                    // TODO only call onChange if manufacturer.id is changed, FinalFormSelect probably needs some changes
                                    input.onChange(formState.values.manufacturer?.id);
                                }
                            }}
                        />
                        <FormSpy<FormValues>>
                            {({ values, form }) => {
                                // send changes of inner form to ManufacturerSelect
                                console.log("ManufacturerSelectFields > FormSpy > ManufacturerSelect-Filter", values);
                                // TODO move ManufacturerSelect out of Form or somehow exclude values not required for filtering
                                return <ManufacturerSelect filter={values} />;
                            }}
                        </FormSpy>
                    </div>
                )}
            />
        </>
    );
}

function ManufacturerSelect(props: { filter?: FormValues }): React.ReactElement {
    const client = useApolloClient();
    const manufacturerSelectAsyncProps = useAsyncOptionsProps(async () => {
        const manufacturers = await client.query<GQLProductManufacturersQuery, GQLProductManufacturersQueryVariables>({
            query: productManufacturersQuery,
            variables: {
                // same problem as with outer level: FormValues contains more than required for query, in this case used-count
                filter: props.filter ? { addressAsEmbeddable_country: { equal: props.filter.country?.id } } : undefined,
            },
        });
        return manufacturers.data.manufacturers.nodes;
    });

    return (
        <Field // TODO use async-select without final-form wrapper => no need to use FormSpy in ManufacturerSelectFields for manufacturer.id
            fullWidth
            name="manufacturer"
            label={<FormattedMessage id="product.manufacturer" defaultMessage="Manufacturer" />}
            component={FinalFormSelect}
            {...manufacturerSelectAsyncProps}
            getOptionLabel={(option: GQLManufacturersOptionsFragment) => (option.updatedAt ? `${option.updatedAt}_XX` : "unknown")}
        />
    );
}
