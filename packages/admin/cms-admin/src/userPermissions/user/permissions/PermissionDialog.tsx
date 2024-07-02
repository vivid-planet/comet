import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, Field, FinalForm, FinalFormCheckbox, FinalFormInput, FinalFormSelect, FormSection, Loading, SaveButton } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { Dialog, DialogActions, DialogContent, DialogTitle, InputBaseProps, styled } from "@mui/material";
import React from "react";
import { FieldRenderProps, Form } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { UserPermissionsSettings } from "../../UserPermissionsPage";
import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import {
    GQLAvailablePermissionsQuery,
    GQLAvailablePermissionsQueryVariables,
    GQLCreateUserPermissionMutation,
    GQLCreateUserPermissionMutationVariables,
    GQLPermissionQuery,
    GQLPermissionQueryVariables,
    GQLUpdateUserPermissionMutation,
    GQLUpdateUserPermissionMutationVariables,
    GQLUserPermissionDialogFragment,
    namedOperations,
} from "./PermissionDialog.generated";

const CheckboxConfiguration = ({ configuration }: { configuration: Record<string, boolean> }) => {
    return (
        <>
            {Object.keys(configuration).map((key) => (
                <Field key={key} name={key} component={FinalFormCheckbox} type="checkbox" label={camelCaseToHumanReadable(key)} />
            ))}
        </>
    );
};

type ConfigurationProps = InputBaseProps &
    FieldRenderProps<JSON, HTMLInputElement | HTMLTextAreaElement> & {
        configurationComponent: () => React.ReactNode;
    };
const Configuration = ({ configurationComponent, input, disabled }: ConfigurationProps) => {
    const ConfigurationComponent = ({ values }: { values: JSON }) => {
        React.useEffect(() => {
            if (input.value !== values) {
                input.onChange(values);
            }
        }, [values]);
        return configurationComponent();
    };
    return (
        <FormSection title={<FormattedMessage id="comet.userPermissions.configuration" defaultMessage="Configuration" />}>
            <Fieldset disabled={disabled}>
                <Form
                    onSubmit={() => {
                        /* */
                    }}
                    initialValues={input.value}
                    render={ConfigurationComponent}
                />
            </Fieldset>
        </FormSection>
    );
};

// TODO Find better way to disable all children
const Fieldset = styled("fieldset")`
    border: none;
`;

interface FormProps {
    userId: string;
    permissionId: string | "add";
    handleDialogClose: () => void;
}
export const PermissionDialog: React.FC<FormProps> = ({ userId, permissionId, handleDialogClose }) => {
    const settings = React.useContext(UserPermissionsSettings);
    const client = useApolloClient();
    const submit = async (submitData: GQLUserPermissionDialogFragment) => {
        const { source, __typename, ...data } = submitData; // Remove source and __typename from data

        if (permissionId && permissionId !== "add") {
            await client.mutate<GQLUpdateUserPermissionMutation, GQLUpdateUserPermissionMutationVariables>({
                mutation: gql`
                    mutation UpdateUserPermission($id: String!, $input: UserPermissionInput!) {
                        userPermissionsUpdatePermission(id: $id, input: $input) {
                            id
                        }
                    }
                `,
                variables: { id: permissionId, input: data },
                refetchQueries: [namedOperations.Query.Permission, "Permissions"],
            });
        } else {
            await client.mutate<GQLCreateUserPermissionMutation, GQLCreateUserPermissionMutationVariables>({
                mutation: gql`
                    mutation CreateUserPermission($userId: String!, $input: UserPermissionInput!) {
                        userPermissionsCreatePermission(userId: $userId, input: $input) {
                            id
                        }
                    }
                `,
                variables: { userId, input: { ...data } },
                refetchQueries: [namedOperations.Query.Permission, "Permissions"],
            });
        }
        handleDialogClose();
    };

    const { data, error } = useQuery<GQLPermissionQuery, GQLPermissionQueryVariables>(
        gql`
            query Permission($permissionId: ID!, $userId: String) {
                userPermission: userPermissionsPermission(id: $permissionId, userId: $userId) {
                    ...UserPermissionDialog
                }
            }
            fragment UserPermissionDialog on UserPermission {
                permission
                configuration
                source
                validFrom
                validTo
                reason
                requestedBy
                approvedBy
            }
        `,
        {
            skip: permissionId === "add",
            variables: { permissionId, userId },
        },
    );
    const { data: availablePermissionsData, error: availablePermissionsError } = useQuery<
        GQLAvailablePermissionsQuery,
        GQLAvailablePermissionsQueryVariables
    >(
        gql`
            query AvailablePermissions {
                availablePermissions: userPermissionsAvailablePermissions {
                    permission
                    configuration
                }
            }
        `,
    );

    if (error) {
        throw new Error(error.message);
    }
    if (availablePermissionsError) {
        throw new Error(availablePermissionsError.message);
    }
    if (!availablePermissionsData || (permissionId !== "add" && !data)) {
        return <Loading />;
    }

    const initialValues = data
        ? {
              ...data.userPermission,
              validFrom: data.userPermission.validFrom ? new Date(data.userPermission.validFrom) : null,
              validTo: data.userPermission.validTo ? new Date(data.userPermission.validTo) : null,
          }
        : {};

    const disabled = data && data.userPermission.source === "BY_RULE";

    return (
        <Dialog maxWidth="sm" open={true}>
            <FinalForm<GQLUserPermissionDialogFragment>
                mode={permissionId ? "edit" : "add"}
                onSubmit={submit}
                onAfterSubmit={() => null}
                initialValues={initialValues}
                render={({ values }) => {
                    const configuration = availablePermissionsData.availablePermissions.find(
                        (p) => p.permission === values.permission,
                    )?.configuration;
                    let configurationComponent;
                    if (configuration) {
                        if (settings.configurationSlots && settings.configurationSlots[values.permission]) {
                            configurationComponent = settings.configurationSlots[values.permission];
                        } else {
                            configurationComponent = () => <CheckboxConfiguration configuration={configuration} />;
                            if (!values.configuration) values.configuration = configuration; // By default enable all sub-permissions
                        }
                    }
                    return (
                        <>
                            <DialogTitle>
                                <FormattedMessage id="comet.userPermissions.showPermission" defaultMessage="Show permission" />
                            </DialogTitle>
                            <DialogContent>
                                <Field
                                    required
                                    fullWidth
                                    name="permission"
                                    component={FinalFormSelect}
                                    options={availablePermissionsData.availablePermissions.map((p) => p.permission)}
                                    getOptionLabel={(permission: string) => camelCaseToHumanReadable(permission)}
                                    disabled={disabled}
                                    label={<FormattedMessage id="comet.userPermissions.permission" defaultMessage="Permission" />}
                                />
                                {configurationComponent && (
                                    <Field
                                        name="configuration"
                                        type="hidden"
                                        component={Configuration}
                                        disabled={disabled}
                                        configurationComponent={configurationComponent}
                                    />
                                )}
                                <Field
                                    name="validFrom"
                                    label={<FormattedMessage id="comet.userPermissions.validFrom" defaultMessage="Valid from" />}
                                    fullWidth
                                    component={FinalFormDatePicker}
                                    disabled={disabled}
                                    clearable={true}
                                    formatDateOptions={{ month: "short", day: "numeric", year: "numeric" }}
                                />
                                <Field
                                    name="validTo"
                                    label={<FormattedMessage id="comet.userPermissions.validTo" defaultMessage="Valid to" />}
                                    fullWidth
                                    component={FinalFormDatePicker}
                                    disabled={disabled}
                                    clearable={true}
                                    formatDateOptions={{ month: "short", day: "numeric", year: "numeric" }}
                                />
                                <FormSection title={<FormattedMessage id="comet.userPermissions.documentation" defaultMessage="Documentation" />}>
                                    <Field
                                        fullWidth
                                        name="reason"
                                        component={FinalFormInput}
                                        disabled={disabled}
                                        label={<FormattedMessage id="comet.userPermissions.reason" defaultMessage="Reason" />}
                                        disableContentTranslation
                                    />
                                    <Field
                                        fullWidth
                                        name="requestedBy"
                                        component={FinalFormInput}
                                        disabled={disabled}
                                        label={<FormattedMessage id="comet.userPermissions.requestedBy" defaultMessage="Requested by" />}
                                        disableContentTranslation
                                    />
                                    <Field
                                        fullWidth
                                        name="approvedBy"
                                        component={FinalFormInput}
                                        disabled={disabled}
                                        label={<FormattedMessage id="comet.userPermissions.approvedBy" defaultMessage="Approved by" />}
                                        disableContentTranslation
                                    />
                                </FormSection>
                            </DialogContent>
                            <DialogActions>
                                <CancelButton onClick={handleDialogClose}>
                                    <FormattedMessage id="comet.userPermissions.close" defaultMessage="Close" />
                                </CancelButton>
                                {!disabled && <SaveButton type="submit" />}
                            </DialogActions>
                        </>
                    );
                }}
            />
        </Dialog>
    );
};
