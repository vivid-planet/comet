import { gql, useQuery } from "@apollo/client";
import { Field, FinalForm, FinalFormInput, FinalFormSelect, Loading } from "@comet/admin";
import isEqual from "lodash.isequal";
import { type FunctionComponent, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import type { ContentScope } from "../ContentScopeDataGrid";
import type { GQLAvailableContentScopesQuery } from "./SelectScopesDialogContent.generated";

interface SelectScopesDialogContentProps {
    /** Called with the built scope when the form is submitted. The caller is responsible for persisting it. */
    onSubmit: (scope: ContentScope) => Promise<void> | void;
}

type FormValues = {
    scope: ContentScope;
};

export const SelectScopesDialogContent: FunctionComponent<SelectScopesDialogContentProps> = ({ onSubmit }) => {
    const intl = useIntl();

    // Memoized so that re-renders don't reinitialize the form and discard the selection.
    const initialValues = useMemo<FormValues>(() => ({ scope: {} }), []);

    const { data, error } = useQuery<GQLAvailableContentScopesQuery>(gql`
        query AvailableContentScopes {
            availableContentScopes: userPermissionsAvailableContentScopes {
                scope
                label
            }
            availableContentScopeDimensions: userPermissionsAvailableContentScopeDimensions {
                name
                label
            }
        }
    `);

    const submit = async (values: FormValues) => {
        const scope: ContentScope = Object.fromEntries(
            Object.entries(values.scope)
                .filter(([, value]) => value != null && String(value).trim() !== "")
                .map(([dimension, value]) => [dimension, String(value).trim()]),
        );
        await onSubmit(scope);
    };

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        return <Loading />;
    }

    // Dimensions whose values are enumerable get a dropdown built from the available content scopes; the remaining declared
    // dimensions (e.g. one with too many values to enumerate) are entered as free text.
    const enumerableOptionsByDimension: Record<string, Array<{ value: string; label: string }>> = {};
    for (const availableContentScope of data.availableContentScopes) {
        for (const [dimension, value] of Object.entries(availableContentScope.scope)) {
            const options = (enumerableOptionsByDimension[dimension] ??= []);
            if (!options.some((option) => option.value === value)) {
                options.push({ value: String(value), label: availableContentScope.label?.[dimension] ?? String(value) });
            }
        }
    }
    const isEnumerableDimension = (dimension: string) => enumerableOptionsByDimension[dimension] !== undefined;
    const enumerableDimensionNames = data.availableContentScopeDimensions.map((dimension) => dimension.name).filter(isEnumerableDimension);

    const validate = ({ scope = {} }: FormValues) => {
        const scopeErrors: Record<string, string> = {};
        for (const dimension of enumerableDimensionNames) {
            if (!scope[dimension]) {
                scopeErrors[dimension] = intl.formatMessage({ id: "comet.userPermissions.selectValue", defaultMessage: "Select a value." });
            }
        }
        // Only a combination of enumerable values that exists in the available content scopes can be assigned
        if (Object.keys(scopeErrors).length === 0) {
            const enumerablePartOfScope = Object.fromEntries(enumerableDimensionNames.map((dimension) => [dimension, scope[dimension]]));
            if (!data.availableContentScopes.some((availableContentScope) => isEqual(availableContentScope.scope, enumerablePartOfScope))) {
                const message = intl.formatMessage({
                    id: "comet.userPermissions.contentScopeDoesNotExist",
                    defaultMessage: "This combination of scopes does not exist.",
                });
                for (const dimension of enumerableDimensionNames) {
                    scopeErrors[dimension] = message;
                }
            }
        }
        return Object.keys(scopeErrors).length > 0 ? { scope: scopeErrors } : {};
    };

    return (
        <FinalForm<FormValues>
            subscription={{ values: true }}
            mode="edit"
            onSubmit={submit}
            onAfterSubmit={() => null}
            initialValues={initialValues}
            validate={validate}
        >
            {data.availableContentScopeDimensions.map((dimension) => {
                if (isEnumerableDimension(dimension.name)) {
                    const options = enumerableOptionsByDimension[dimension.name];
                    return (
                        <Field
                            key={dimension.name}
                            name={`scope.${dimension.name}`}
                            label={dimension.label}
                            fullWidth
                            required
                            component={FinalFormSelect}
                            options={options.map((option) => option.value)}
                            getOptionLabel={(value: string) => options.find((option) => option.value === value)?.label ?? value}
                        />
                    );
                }
                return (
                    <Field
                        key={dimension.name}
                        name={`scope.${dimension.name}`}
                        label={dimension.label}
                        helperText={<FormattedMessage id="comet.userPermissions.allValuesHint" defaultMessage="* for All" />}
                        fullWidth
                        component={FinalFormInput}
                    />
                );
            })}
        </FinalForm>
    );
};
