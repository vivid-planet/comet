/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable @calm/react-intl/missing-formatted-message */
import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    type AsyncOptionsProps,
    FieldContainer,
    type FieldContainerProps,
    filterByFragment,
    Loading,
    Savable,
    useAsyncOptionsProps,
    useSaveBoundaryApi,
} from "@comet/admin";
import { InputBase, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { type ReactNode, useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { type GQLProductCategoriesSelectQuery, type GQLProductCategoriesSelectQueryVariables } from "./ProductFormTanstack.generated";
import { createProductMutation, productFormFragment, productQuery, updateProductMutation } from "./ProductFormTanstack.gql";
import {
    type GQLCreateProductMutation,
    type GQLCreateProductMutationVariables,
    type GQLProductFormTanstackFragment,
    type GQLProductQuery,
    type GQLProductQueryVariables,
    type GQLUpdateProductMutation,
    type GQLUpdateProductMutationVariables,
} from "./ProductFormTanstack.gql.generated";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();
/*
todo:
- mehr fields implementieren
- checkForConflict
- fields in library: wo soll createFormHook liegen? (library od. app?)
- warnings
- required (boolean prop): brauchen wir das wirklich?
- scrollTo

offene fragen:
- validation wie? zod o.ä. auf form ebene oder field ebene?

nachteile:
- default values müssen gesetzt werden damit isDirty (=isDefaultValue in Tanstack Form) beim hinzufügen funktioniert
- immer 2 komponenten pro feld notwendig

*/

type TanstackFieldContainerProps = Pick<FieldContainerProps, "label" | "variant" | "fullWidth" | "helperText">;

export function TanstackTextField({ label, variant, fullWidth, helperText }: TanstackFieldContainerProps) {
    // The `Field` infers that it should have a `value` type of `string`
    const field = useFieldContext<string>();
    const error = !field.state.meta.isValid ? field.state.meta.errors.join(", ") : undefined;
    return (
        <FieldContainer label={label} variant={variant} fullWidth={fullWidth} helperText={helperText} error={error}>
            <InputBase value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
        </FieldContainer>
    );
}

type TanstackAsyncSelectFieldProps<T> = TanstackFieldContainerProps &
    Partial<AsyncOptionsProps<T>> & {
        noOptionsText?: ReactNode;
        errorText?: ReactNode;
        loadOptions: () => Promise<T[]>;
        getOptionLabel?: (option: T) => string;
        getOptionValue?: (option: T) => string;
    };

export function TanstackAsyncSelectField<T>({
    label,
    variant,
    fullWidth,
    helperText,
    loadOptions,
    getOptionLabel = (option: T) => {
        if (typeof option === "object") {
            console.error(`The \`getOptionLabel\` method of FinalFormSelect returned an object instead of a string for${JSON.stringify(option)}.`);
        }
        return "";
    },
    getOptionValue = (option: T) => {
        if (typeof option === "object" && option !== null) {
            if ((option as any).id) return String((option as any).id);
            if ((option as any).value) return String((option as any).value);
            return JSON.stringify(option);
        } else {
            return String(option);
        }
    },

    noOptionsText = (
        <Typography variant="body2">
            <FormattedMessage id="finalFormSelect.noOptions" defaultMessage="No options." />
        </Typography>
    ),
    errorText = (
        <Typography variant="body2">
            <FormattedMessage id="finalFormSelect.error" defaultMessage="Error loading options." />
        </Typography>
    ),
}: TanstackAsyncSelectFieldProps<T>) {
    /* TODO multiple support */
    const field = useFieldContext<T>();
    const error = !field.state.meta.isValid ? field.state.meta.errors.join(", ") : undefined;

    const asyncOptionsProps = useAsyncOptionsProps(loadOptions);
    const options = asyncOptionsProps.options;
    const loading = asyncOptionsProps.loading;
    const loadingError = asyncOptionsProps.loadingError;

    const showLoadingMessage = loading === true && options.length === 0 && loadingError == null;
    const showLinearProgress = loading === true && !showLoadingMessage;
    const showOptions = options.length > 0 && loadingError == null;
    const showError = loadingError != null && !loading;
    const showNoOptions = loading === false && loadingError == null && options.length === 0;

    return (
        <FieldContainer label={label} variant={variant} fullWidth={fullWidth} helperText={helperText} error={error}>
            <Select
                onChange={(event) => {
                    const value = event.target.value;
                    const formValue = options.find((i) => getOptionValue(i) == value);
                    if (formValue === undefined) {
                        throw new Error();
                    }
                    field.handleChange(formValue);
                }}
                value={getOptionValue(field.state.value)}
                renderValue={() => {
                    if (!field.state.value) return null; //why is this case not needed for final-form?
                    return getOptionLabel(field.state.value);
                }}
                onBlur={field.handleBlur}
                {...asyncOptionsProps}
            >
                {showLinearProgress && <LinearProgress />}
                {showLoadingMessage && <FormattedMessage id="common.loading" defaultMessage="Loading ..." />}

                {options.length === 0 && field.state.value && (
                    <MenuItem value={getOptionValue(field.state.value)} key={getOptionValue(field.state.value)} sx={{ display: "none" }}>
                        {getOptionLabel(field.state.value)}
                    </MenuItem>
                )}

                {showNoOptions && (
                    <MenuItem value="" disabled>
                        {noOptionsText}
                    </MenuItem>
                )}
                {showError && (
                    <MenuItem value="" disabled>
                        {errorText}
                    </MenuItem>
                )}

                {showOptions &&
                    options.map((option: T) => (
                        <MenuItem value={getOptionValue(option)} key={getOptionValue(option)}>
                            {getOptionLabel(option)}
                        </MenuItem>
                    ))}
            </Select>
        </FieldContainer>
    );
}

function TanstackSavable() {
    const form = useFormContext();
    return (
        <form.Subscribe selector={(state) => state.isDefaultValue}>
            {(isDefaultValue) => (
                <Savable
                    hasChanges={!isDefaultValue}
                    doSave={async () => {
                        await form.handleSubmit();
                        // TODO return false if save failed (does handleSubmit throw on failure?)
                        return true;
                    }}
                    doReset={form.reset}
                    checkForChanges={() => {
                        return !form.state.isDefaultValue;
                    }}
                />
            )}
        </form.Subscribe>
    );
}

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
    fieldComponents: {
        TextField: TanstackTextField,
        AsyncSelectField: TanstackAsyncSelectField,
    },
    formComponents: {
        Savable: TanstackSavable,
    },
    fieldContext,
    formContext,
});

interface FormProps {
    id?: string;
    onCreate?: (id: string) => void;
}

//type FormValues = GQLProductFormTanstackFragment;

export function ProductFormTanstack({ id, onCreate }: FormProps) {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";

    const { data, error, loading, refetch } = useQuery<GQLProductQuery, GQLProductQueryVariables>(
        productQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const defaultValues = useMemo(() => {
        const filteredData = data ? filterByFragment<GQLProductFormTanstackFragment>(productFormFragment, data.product) : undefined;
        if (!filteredData) {
            return {
                //title: "",
                slug: "",
                category: null,
                statistics: {
                    views: 0,
                },
            };
        }
        return {
            ...filteredData,
        };
    }, [data]);

    const saveBoundaryApi = useSaveBoundaryApi();
    if (!saveBoundaryApi) throw new Error("SaveBoundary is not available");

    const form = useAppForm({
        /*defaultValues: {
            title: data?.product.title ?? "",
            slug: data?.product.slug ?? "",
            statistics: {
                views: data?.product.statistics?.views ?? 0,
            },
            category: data?.product.category ?? null,
        },
        */
        defaultValues,
        onSubmit: async ({ value }) => {
            //TODO if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");

            const output = { ...value, category: value.category ? value.category.id : null };

            if (mode === "edit") {
                if (!id) throw new Error();
                await client.mutate<GQLUpdateProductMutation, GQLUpdateProductMutationVariables>({
                    mutation: updateProductMutation,
                    variables: { id, input: output },
                });
            } else {
                const { data: mutationResponse } = await client.mutate<GQLCreateProductMutation, GQLCreateProductMutationVariables>({
                    mutation: createProductMutation,
                    variables: { input: output },
                });
                const id = mutationResponse?.createProduct.id;
                if (id) {
                    setTimeout(() => {
                        onCreate?.(id);
                    });
                }
            }
        },
    });

    if (error) throw error;

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <form.AppForm>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    saveBoundaryApi.save();
                }}
            >
                <form.Savable />
                <h1>Personal Information</h1>
                <form.AppField name="title" children={(field) => <field.TextField label="Title" variant="horizontal" fullWidth />} />
                <form.AppField
                    name="slug"
                    validators={{
                        onChange: ({ value }) => (value === "" ? "Field is Required" : undefined),
                    }}
                    children={(field) => <field.TextField label="Slug" variant="horizontal" fullWidth />}
                />
                <form.AppField name="statistics.views" children={(field) => <field.TextField label="Views" variant="horizontal" fullWidth />} />
                <form.AppField
                    name="category"
                    children={(field) => (
                        <field.AsyncSelectField
                            label="Category"
                            variant="horizontal"
                            fullWidth
                            loadOptions={async () => {
                                const { data } = await client.query<GQLProductCategoriesSelectQuery, GQLProductCategoriesSelectQueryVariables>({
                                    query: gql`
                                        query ProductCategoriesSelect {
                                            productCategories {
                                                nodes {
                                                    id
                                                    title
                                                }
                                            }
                                        }
                                    `,
                                });

                                return data.productCategories.nodes;
                            }}
                            getOptionLabel={(option) => option.title}
                        />
                    )}
                />
            </form>
        </form.AppForm>
    );
}
