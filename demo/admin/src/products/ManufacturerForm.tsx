import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FieldSet,
    filterByFragment,
    FinalForm,
    FinalFormInput,
    FinalFormSubmitEvent,
    Loading,
    MainContent,
    TextField,
    useFormApiRef,
    useStackSwitchApi,
} from "@comet/admin";
import { EditPageLayout, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { FormApi } from "final-form";
import isEqual from "lodash.isequal";
import React from "react";
import { FormattedMessage } from "react-intl";

import { createManufacturerMutation, manufacturerFormFragment, manufacturerQuery, updateManufacturerMutation } from "./ManufacturerForm.gql";
import {
    GQLCreateManufacturerMutation,
    GQLCreateManufacturerMutationVariables,
    GQLManufacturerFormDetailsFragment,
    GQLManufacturerQuery,
    GQLManufacturerQueryVariables,
    GQLUpdateManufacturerMutation,
    GQLUpdateManufacturerMutationVariables,
} from "./ManufacturerForm.gql.generated";

type FormValues = Omit<GQLManufacturerFormDetailsFragment, "address" | "addressAsEmbeddable"> & {
    address:
        | (Omit<NonNullable<GQLManufacturerFormDetailsFragment["address"]>, "streetNumber" | "zip" | "alternativeAddress"> & {
              streetNumber: string | null;
              zip: string;
              alternativeAddress:
                  | (Omit<NonNullable<NonNullable<GQLManufacturerFormDetailsFragment["address"]>["alternativeAddress"]>, "streetNumber" | "zip"> & {
                        streetNumber: string | null;
                        zip: string;
                    })
                  | null;
          })
        | null;
    addressAsEmbeddable:
        | Omit<NonNullable<GQLManufacturerFormDetailsFragment["addressAsEmbeddable"]>, "streetNumber" | "zip" | "alternativeAddress"> & {
              streetNumber: string | null;
              zip: string;
              alternativeAddress:
                  | Omit<
                        NonNullable<NonNullable<GQLManufacturerFormDetailsFragment["addressAsEmbeddable"]>["alternativeAddress"]>,
                        "streetNumber" | "zip"
                    > & {
                        streetNumber: string | null;
                        zip: string;
                    };
          };
};

interface FormProps {
    id?: string;
}

export function ManufacturerForm({ id }: FormProps): React.ReactElement {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();

    const { data, error, loading, refetch } = useQuery<GQLManufacturerQuery, GQLManufacturerQueryVariables>(
        manufacturerQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues = React.useMemo<Partial<FormValues>>(() => {
        const filteredData = data ? filterByFragment<GQLManufacturerFormDetailsFragment>(manufacturerFormFragment, data.manufacturer) : undefined;
        if (!filteredData) return {};
        return {
            ...filteredData,
            address: filteredData.address
                ? {
                      ...filteredData.address,
                      streetNumber: filteredData.address.streetNumber ? String(filteredData.address.streetNumber) : null,
                      zip: String(filteredData.address.zip),
                      alternativeAddress: filteredData.address.alternativeAddress
                          ? {
                                ...filteredData.address.alternativeAddress,
                                streetNumber: filteredData.address.alternativeAddress.streetNumber
                                    ? String(filteredData.address.alternativeAddress.streetNumber)
                                    : null,
                                zip: String(filteredData.address.alternativeAddress.zip),
                            }
                          : undefined,
                  }
                : undefined,
            addressAsEmbeddable: {
                ...filteredData.addressAsEmbeddable,
                streetNumber: filteredData.addressAsEmbeddable.streetNumber ? String(filteredData.addressAsEmbeddable.streetNumber) : null,
                zip: String(filteredData.addressAsEmbeddable.zip),
                alternativeAddress: {
                    ...filteredData.addressAsEmbeddable.alternativeAddress,
                    streetNumber: filteredData.addressAsEmbeddable.alternativeAddress.streetNumber
                        ? String(filteredData.addressAsEmbeddable.alternativeAddress.streetNumber)
                        : null,
                    zip: String(filteredData.addressAsEmbeddable.alternativeAddress.zip),
                },
            },
        };
    }, [data]);

    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            const updatedAt = await queryUpdatedAt(client, "manufacturer", id);
            return resolveHasSaveConflict(data?.manufacturer.updatedAt, updatedAt);
        },
        formApiRef,
        loadLatestVersion: async () => {
            await refetch();
        },
    });

    const handleSubmit = async (formValues: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
        if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");
        const output = {
            ...formValues,
            address: formValues.address
                ? {
                      ...formValues.address,
                      streetNumber: formValues.address?.streetNumber ? parseInt(formValues.address.streetNumber) : null,
                      zip: parseInt(formValues.address.zip),
                      alternativeAddress: formValues.address?.alternativeAddress
                          ? {
                                ...formValues.address.alternativeAddress,
                                streetNumber: formValues.address?.alternativeAddress.streetNumber
                                    ? parseInt(formValues.address.alternativeAddress.streetNumber)
                                    : null,
                                zip: parseInt(formValues.address.alternativeAddress.zip),
                            }
                          : undefined,
                  }
                : undefined,
            addressAsEmbeddable: {
                ...formValues.addressAsEmbeddable,
                streetNumber: formValues.addressAsEmbeddable?.streetNumber ? parseInt(formValues.addressAsEmbeddable.streetNumber) : null,
                zip: parseInt(formValues.addressAsEmbeddable.zip),
                alternativeAddress: {
                    ...formValues.addressAsEmbeddable.alternativeAddress,
                    streetNumber: formValues.addressAsEmbeddable?.alternativeAddress.streetNumber
                        ? parseInt(formValues.addressAsEmbeddable.alternativeAddress.streetNumber)
                        : null,
                    zip: parseInt(formValues.addressAsEmbeddable.alternativeAddress.zip),
                },
            },
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            await client.mutate<GQLUpdateManufacturerMutation, GQLUpdateManufacturerMutationVariables>({
                mutation: updateManufacturerMutation,
                variables: { id, input: output },
            });
        } else {
            const { data: mutationResponse } = await client.mutate<GQLCreateManufacturerMutation, GQLCreateManufacturerMutationVariables>({
                mutation: createManufacturerMutation,
                variables: { input: output },
            });
            if (!event.navigatingBack) {
                const id = mutationResponse?.createManufacturer.id;
                if (id) {
                    setTimeout(() => {
                        stackSwitchApi.activatePage(`edit`, id);
                    });
                }
            }
        }
    };

    if (error) throw error;

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <FinalForm<FormValues>
            apiRef={formApiRef}
            onSubmit={handleSubmit}
            mode={mode}
            initialValues={initialValues}
            initialValuesEqual={isEqual} //required to compare block data correctly
            subscription={{}}
        >
            {() => (
                <EditPageLayout>
                    {saveConflict.dialogs}
                    <MainContent>
                        <FieldSet
                            title={<FormattedMessage id="manufacturer.address" defaultMessage="Address" />}
                            supportText={<FormattedMessage id="manufacturer.address.supportText" defaultMessage="The main address" />}
                            collapsible={true}
                            initiallyExpanded={true}
                        >
                            <TextField
                                required
                                fullWidth
                                name="address.street"
                                label={<FormattedMessage id="manufacturer.address.street" defaultMessage="Address Street" />}
                            />
                            <Field
                                fullWidth
                                name="address.streetNumber"
                                component={FinalFormInput}
                                type="number"
                                label={<FormattedMessage id="manufacturer.address.streetNumber" defaultMessage="Address Street Number" />}
                            />
                            <Field
                                required
                                fullWidth
                                name="address.zip"
                                component={FinalFormInput}
                                type="number"
                                label={<FormattedMessage id="manufacturer.address.zip" defaultMessage="Address Zip" />}
                            />
                            <TextField
                                required
                                fullWidth
                                name="address.country"
                                label={<FormattedMessage id="manufacturer.address.country" defaultMessage="Address Country" />}
                            />
                            <FieldSet
                                collapsible={true}
                                initiallyExpanded={false}
                                title={<FormattedMessage id="manufacturer.address.alternativeAddress" defaultMessage="Alt-Address" />}
                                supportText={
                                    <FormattedMessage
                                        id="manufacturer.address.alternativeAddress.supportText"
                                        defaultMessage="An alt-address to be used"
                                    />
                                }
                            >
                                <TextField
                                    required
                                    fullWidth
                                    name="address.alternativeAddress.street"
                                    label={
                                        <FormattedMessage id="manufacturer.address.alternativeAddress.street" defaultMessage="Alt-Address Street" />
                                    }
                                />
                                <Field
                                    fullWidth
                                    name="address.alternativeAddress.streetNumber"
                                    component={FinalFormInput}
                                    type="number"
                                    label={
                                        <FormattedMessage
                                            id="manufacturer.address.alternativeAddress.streetNumber"
                                            defaultMessage="Alt-Address Street Number"
                                        />
                                    }
                                />
                                <Field
                                    required
                                    fullWidth
                                    name="address.alternativeAddress.zip"
                                    component={FinalFormInput}
                                    type="number"
                                    label={<FormattedMessage id="manufacturer.address.alternativeAddress.zip" defaultMessage="Alt-Address Zip" />}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    name="address.alternativeAddress.country"
                                    label={
                                        <FormattedMessage id="manufacturer.address.alternativeAddress.country" defaultMessage="Alt-Address Country" />
                                    }
                                />
                            </FieldSet>
                        </FieldSet>
                        <FieldSet
                            collapsible={false}
                            title={<FormattedMessage id="manufacturer.address.alternativeAddress.country" defaultMessage="Address as embeddable" />}
                        >
                            <TextField
                                required
                                fullWidth
                                name="addressAsEmbeddable.street"
                                label={<FormattedMessage id="manufacturer.address.street" defaultMessage="Address Street" />}
                            />
                            <Field
                                fullWidth
                                name="addressAsEmbeddable.streetNumber"
                                component={FinalFormInput}
                                type="number"
                                label={<FormattedMessage id="manufacturer.address.streetNumber" defaultMessage="Address Street Number" />}
                            />
                            <Field
                                required
                                fullWidth
                                name="addressAsEmbeddable.zip"
                                component={FinalFormInput}
                                type="number"
                                label={<FormattedMessage id="manufacturer.address.zip" defaultMessage="Address Zip" />}
                            />
                            <TextField
                                required
                                fullWidth
                                name="addressAsEmbeddable.country"
                                label={<FormattedMessage id="manufacturer.address.country" defaultMessage="Address Country" />}
                            />
                            <TextField
                                required
                                fullWidth
                                name="addressAsEmbeddable.alternativeAddress.street"
                                label={<FormattedMessage id="manufacturer.address.alternativeAddress.street" defaultMessage="Alt-Address Street" />}
                            />
                            <Field
                                fullWidth
                                name="addressAsEmbeddable.alternativeAddress.streetNumber"
                                component={FinalFormInput}
                                type="number"
                                label={
                                    <FormattedMessage
                                        id="manufacturer.address.alternativeAddress.streetNumber"
                                        defaultMessage="Alt-Address Street Number"
                                    />
                                }
                            />
                            <Field
                                required
                                fullWidth
                                name="addressAsEmbeddable.alternativeAddress.zip"
                                component={FinalFormInput}
                                type="number"
                                label={<FormattedMessage id="manufacturer.address.alternativeAddress.zip" defaultMessage="Alt-Address Zip" />}
                            />
                            <TextField
                                required
                                fullWidth
                                name="addressAsEmbeddable.alternativeAddress.country"
                                label={<FormattedMessage id="manufacturer.address.alternativeAddress.country" defaultMessage="Alt-Address Country" />}
                            />
                        </FieldSet>
                    </MainContent>
                </EditPageLayout>
            )}
        </FinalForm>
    );
}
