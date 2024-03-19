import { useApolloClient, useQuery } from "@apollo/client";
import {
    Field,
    FieldSet,
    FinalForm,
    FinalFormInput,
    FinalFormSaveSplitButton,
    FinalFormSubmitEvent,
    Loading,
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
import { EditPageLayout, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { IconButton } from "@mui/material";
import { FormApi } from "final-form";
import { filter } from "graphql-anywhere";
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
    const stackApi = useStackApi();
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();

    const { data, error, loading, refetch } = useQuery<GQLManufacturerQuery, GQLManufacturerQueryVariables>(
        manufacturerQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues = React.useMemo<Partial<FormValues>>(
        () =>
            data?.manufacturer
                ? {
                      ...filter<GQLManufacturerFormDetailsFragment>(manufacturerFormFragment, {
                          ...data.manufacturer,
                          address: data.manufacturer.address
                              ? {
                                    ...data.manufacturer.address,
                                    streetNumber: data.manufacturer.address.streetNumber ? String(data.manufacturer.address.streetNumber) : null,
                                    zip: String(data.manufacturer.address.zip),
                                    alternativeAddress: data.manufacturer.address.alternativeAddress
                                        ? {
                                              ...data.manufacturer.address.alternativeAddress,
                                              streetNumber: data.manufacturer.address.alternativeAddress.streetNumber
                                                  ? String(data.manufacturer.address.alternativeAddress.streetNumber)
                                                  : null,
                                              zip: String(data.manufacturer.address.alternativeAddress.zip),
                                          }
                                        : undefined,
                                }
                              : undefined,
                          addressAsEmbeddable: {
                              ...data.manufacturer.addressAsEmbeddable,
                              streetNumber: data.manufacturer.addressAsEmbeddable.streetNumber
                                  ? String(data.manufacturer.addressAsEmbeddable.streetNumber)
                                  : null,
                              zip: String(data.manufacturer.addressAsEmbeddable.zip),
                              alternativeAddress: {
                                  ...data.manufacturer.addressAsEmbeddable.alternativeAddress,
                                  streetNumber: data.manufacturer.addressAsEmbeddable.alternativeAddress.streetNumber
                                      ? String(data.manufacturer.addressAsEmbeddable.alternativeAddress.streetNumber)
                                      : null,
                                  zip: String(data.manufacturer.addressAsEmbeddable.alternativeAddress.zip),
                              },
                          },
                      }),
                  }
                : {},
        [data],
    );

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
                variables: { id, input: output, lastUpdatedAt: data?.manufacturer.updatedAt },
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
                                        <FormattedMessage id="manufacturer.manufacturerDetail" defaultMessage="Manufacturer Detail" />
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
