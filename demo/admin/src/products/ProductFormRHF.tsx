/* eslint-disable @calm/react-intl/missing-formatted-message */
import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    ClearInputAdornment,
    FieldContainer,
    type FieldContainerProps,
    filterByFragment,
    Loading,
    Savable,
    useAsyncOptionsProps,
    useSaveBoundaryApi,
} from "@comet/admin";
import { InputBase, type InputBaseProps, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { type ChangeEvent, type FocusEvent, type ReactNode, useCallback, useEffect, useState } from "react";
import {
    Controller,
    type ControllerRenderProps,
    type FieldPath,
    type FieldPathByValue,
    type FieldValues,
    FormProvider,
    type PathValue,
    type SubmitHandler,
    type UseControllerProps,
    useForm,
    useFormContext,
    type UseFormReturn,
    useFormState,
} from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { type GQLProductCategoriesSelectQuery, type GQLProductCategoriesSelectQueryVariables } from "./ProductFormRHF.generated";
import { createProductMutation, productFormFragment, productQuery, updateProductMutation } from "./ProductFormRHF.gql";
import {
    type GQLCreateProductMutation,
    type GQLCreateProductMutationVariables,
    type GQLProductFormRHFFragment,
    type GQLProductQuery,
    type GQLProductQueryVariables,
    type GQLUpdateProductMutation,
    type GQLUpdateProductMutationVariables,
} from "./ProductFormRHF.gql.generated";

type RHFTextFieldProps<
    TFieldValues extends FieldValues,
    TName extends FieldPathByValue<TFieldValues, string | null>,
    TTransformedValues,
> = UseControllerProps<TFieldValues, TName, TTransformedValues> &
    Pick<FieldContainerProps, "label" | "variant" | "fullWidth" | "helperText"> &
    InputBaseProps;

export function RHFTextField<TFieldValues extends FieldValues, TName extends FieldPathByValue<TFieldValues, string | null>, TTransformedValues>({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled,
    exact,
    label,
    variant,
    fullWidth,
    helperText,
    ...restProps
}: RHFTextFieldProps<TFieldValues, TName, TTransformedValues>) {
    const intl = useIntl();
    return (
        <Controller
            name={name}
            rules={rules}
            shouldUnregister={shouldUnregister}
            defaultValue={defaultValue}
            control={control}
            disabled={disabled}
            exact={exact}
            render={({ field, fieldState }) => {
                let error = undefined;
                if (fieldState.error) {
                    if (fieldState.error.message) {
                        error = fieldState.error.message;
                    } else if (fieldState.error.type == "required") {
                        error = intl.formatMessage({ id: "form.validation.required", defaultMessage: "Required" });
                    } else {
                        error = fieldState.error.type;
                    }
                }
                return (
                    <FieldContainer label={label} variant={variant} fullWidth={fullWidth} helperText={helperText} error={error}>
                        <InputBase
                            {...restProps}
                            name={field.name}
                            value={field.value ?? ""}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (value === "") {
                                    field.onChange(null);
                                } else {
                                    field.onChange(value);
                                }
                            }}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            disabled={field.disabled}
                        />
                    </FieldContainer>
                );
            }}
        />
    );
}

export function RHFNumberFieldInner<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    clearable,
    endAdornment,
    decimals = 0,
    field,
    ...restProps
}: {
    clearable?: boolean;
    decimals?: number;
    field: ControllerRenderProps<TFieldValues, TName>;
} & InputBaseProps) {
    const intl = useIntl();

    const [formattedNumberValue, setFormattedNumberValue] = useState("");

    const getFormattedValue = useCallback(
        (value: number | null) => {
            const formattedValue =
                value !== null ? intl.formatNumber(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : "";
            return formattedValue;
        },
        [decimals, intl],
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormattedNumberValue(value);
    };

    const updateFormattedNumberValue = useCallback(
        (inputValue: number | null) => {
            if (!inputValue && inputValue !== 0) {
                setFormattedNumberValue("");
            } else {
                setFormattedNumberValue(getFormattedValue(inputValue));
            }
        },
        [getFormattedValue],
    );

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        field.onBlur();
        const { value } = event.target;
        const numberParts = intl.formatNumberToParts(1111.111);
        const decimalSymbol = numberParts.find(({ type }) => type === "decimal")?.value;
        const thousandSeparatorSymbol = numberParts.find(({ type }) => type === "group")?.value;

        const numericValue = parseFloat(
            value
                .split(thousandSeparatorSymbol || "")
                .join("")
                .split(decimalSymbol || ".")
                .join("."),
        );

        const roundToDecimals = (numericValue: number, decimals: number) => {
            const factor = Math.pow(10, decimals);
            return Math.round(numericValue * factor) / factor;
        };

        const inputValue: number | null = isNaN(numericValue) ? null : roundToDecimals(numericValue, decimals);
        field.onChange(inputValue);

        if (field.value === inputValue) {
            updateFormattedNumberValue(inputValue);
        }
    };

    useEffect(() => {
        updateFormattedNumberValue(field.value);
    }, [updateFormattedNumberValue, field.value]);

    return (
        <InputBase
            {...restProps}
            value={formattedNumberValue}
            onChange={handleChange}
            onBlur={handleBlur}
            name={field.name}
            inputRef={field.ref}
            disabled={field.disabled}
            endAdornment={
                (endAdornment || clearable) && (
                    <>
                        {clearable && (
                            <ClearInputAdornment
                                position="end"
                                hasClearableContent={typeof field.value === "number"}
                                onClick={() => field.onChange(null)}
                            />
                        )}
                        {endAdornment}
                    </>
                )
            }
        />
    );
}

type RHFNumberFieldProps<
    TFieldValues extends FieldValues,
    TName extends FieldPathByValue<TFieldValues, number | null>,
    TTransformedValues,
> = UseControllerProps<TFieldValues, TName, TTransformedValues> &
    Pick<FieldContainerProps, "label" | "variant" | "fullWidth" | "helperText"> & { clearable?: boolean; decimals?: number } & InputBaseProps;

export function RHFNumberField<TFieldValues extends FieldValues, TName extends FieldPathByValue<TFieldValues, number | null>, TTransformedValues>({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled,
    exact,
    clearable,
    decimals,
    label,
    variant,
    fullWidth,
    helperText,
    ...restProps
}: RHFNumberFieldProps<TFieldValues, TName, TTransformedValues>) {
    const intl = useIntl();

    return (
        <Controller
            name={name}
            rules={rules}
            shouldUnregister={shouldUnregister}
            defaultValue={defaultValue}
            control={control}
            disabled={disabled}
            exact={exact}
            render={({ field, fieldState }) => {
                let error = undefined;
                if (fieldState.error) {
                    if (fieldState.error.message) {
                        error = fieldState.error.message;
                    } else if (fieldState.error.type == "required") {
                        error = intl.formatMessage({ id: "form.validation.required", defaultMessage: "Required" });
                    } else {
                        error = fieldState.error.type;
                    }
                }
                return (
                    <FieldContainer label={label} variant={variant} fullWidth={fullWidth} helperText={helperText} error={error}>
                        <RHFNumberFieldInner {...restProps} field={field} clearable={clearable} decimals={decimals} />
                    </FieldContainer>
                );
            }}
        />
    );
}

type RHFSelectProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>, TTransformedValues> = UseControllerProps<
    TFieldValues,
    TName,
    TTransformedValues
> &
    Pick<FieldContainerProps, "label" | "variant" | "fullWidth" | "helperText"> & {
        noOptionsText?: ReactNode;
        errorText?: ReactNode;
        loadOptions: () => Promise<PathValue<TFieldValues, TName>[]>;
        getOptionLabel?: (option: NonNullable<PathValue<TFieldValues, TName>>) => string;
        getOptionValue?: (option: NonNullable<PathValue<TFieldValues, TName>>) => string;
    };

export function RHFSelect<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>, TTransformedValues>({
    loadOptions,
    getOptionLabel = (option: PathValue<TFieldValues, TName>) => {
        if (typeof option === "object") {
            console.error(`The \`getOptionLabel\` method of FinalFormSelect returned an object instead of a string for${JSON.stringify(option)}.`);
        }
        return "";
    },
    getOptionValue = (option: PathValue<TFieldValues, TName>) => {
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
    ...props
}: RHFSelectProps<TFieldValues, TName, TTransformedValues>) {
    const intl = useIntl();
    /* TODO multiple support */
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
        <Controller
            name={props.name}
            rules={props.rules}
            shouldUnregister={props.shouldUnregister}
            defaultValue={props.defaultValue}
            control={props.control}
            disabled={props.disabled}
            exact={props.exact}
            render={({ field, fieldState }) => {
                let error = undefined;
                if (fieldState.error) {
                    if (fieldState.error.message) {
                        error = fieldState.error.message;
                    } else if (fieldState.error.type == "required") {
                        error = intl.formatMessage({ id: "form.validation.required", defaultMessage: "Required" });
                    } else {
                        error = fieldState.error.type;
                    }
                }
                return (
                    <FieldContainer
                        label={props.label}
                        variant={props.variant}
                        fullWidth={props.fullWidth}
                        helperText={props.helperText}
                        error={error}
                    >
                        <Select
                            name={field.name}
                            inputRef={field.ref}
                            disabled={field.disabled}
                            onChange={(event) => {
                                const value = event.target.value;
                                const formValue = options.find((i) => getOptionValue(i) == value);
                                if (formValue === undefined) {
                                    throw new Error();
                                }
                                field.onChange(formValue);
                            }}
                            value={getOptionValue(field.value)}
                            renderValue={() => {
                                if (!field.value) return null; //why is this case not needed for final-form?
                                return getOptionLabel(field.value);
                            }}
                            onBlur={field.onBlur}
                            {...asyncOptionsProps}
                        >
                            {showLinearProgress && <LinearProgress />}
                            {showLoadingMessage && <FormattedMessage id="common.loading" defaultMessage="Loading ..." />}

                            {options.length === 0 && field.value && (
                                <MenuItem value={getOptionValue(field.value)} key={getOptionValue(field.value)} sx={{ display: "none" }}>
                                    {getOptionLabel(field.value)}
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
                                options.map((option: PathValue<TFieldValues, TName>) => (
                                    <MenuItem value={getOptionValue(option)} key={getOptionValue(option)}>
                                        {getOptionLabel(option)}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FieldContainer>
                );
            }}
        />
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SavableRHF({ onSubmit }: { onSubmit: SubmitHandler<any> }) {
    const { isDirty } = useFormState();
    const formContext = useFormContext();
    return (
        <Savable
            hasChanges={isDirty}
            doSave={() => {
                return new Promise<boolean>((resolve) => {
                    formContext.handleSubmit(
                        async (values) => {
                            console.log("handleSubmit2");
                            // TODO try/catch here?
                            await onSubmit(values);
                            resolve(true); //sucess
                        },
                        () => {
                            resolve(false); //failure
                        },
                    )();
                });
            }}
            doReset={() => {
                formContext.reset();
            }}
            checkForChanges={() => {
                return formContext.formState.isDirty;
            }}
        />
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RHFFormProps<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> = UseFormReturn<
    TFieldValues,
    TContext,
    TTransformedValues
> & {
    children: ReactNode;
    onSubmit: SubmitHandler<TFieldValues>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RHFForm<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues>({
    children,
    onSubmit,
    ...form
}: RHFFormProps<TFieldValues, TContext, TTransformedValues>) {
    const saveBoundaryApi = useSaveBoundaryApi();
    if (!saveBoundaryApi) throw new Error("SaveBoundary is not available");

    return (
        <FormProvider {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    saveBoundaryApi.save();
                }}
            >
                <SavableRHF onSubmit={onSubmit} />
                {children}
            </form>
        </FormProvider>
    );
}

type FormValues = GQLProductFormRHFFragment;

interface FormProps {
    id?: string;
    onCreate?: (id: string) => void;
}

/*
todo:
- checkForConflict
*/

export function ProductFormRHF({ id, onCreate }: FormProps) {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";

    //const [loadDefaultValues, { /*data,*/ error, loading }] = useLazyQuery<GQLProductQuery, GQLProductQueryVariables>(productQuery);
    //if (error) throw error;

    const { data, error, loading } = useQuery<GQLProductQuery, GQLProductQueryVariables>(productQuery, id ? { variables: { id } } : { skip: true });

    const defaultValues = data
        ? filterByFragment<GQLProductFormRHFFragment>(productFormFragment, data.product)
        : { title: "", price: NaN, category: null, statistics: null };

    const form = useForm<FormValues>({
        mode: "onBlur",
        /*
        defaultValues: async () => {
            if (id) {
                const { data , error } = await loadDefaultValues({ variables: { id } });
                //if (error) throw error;
                if (data) {
                    const defaultValues = filterByFragment<GQLProductFormRHFFragment>(productFormFragment, data.product);
                    console.log("defaultValues", defaultValues);
                    return defaultValues;
                }
                //} else {
                //return { title: "", price: NaN, category: null, statistics: null };
            }
            return { title: "", price: NaN, category: null, statistics: null };
        },
        */
        /*
        defaultValues: async () => {
            if (id) {
                const { data, error } = await client.query<GQLProductQuery, GQLProductQueryVariables>({ query: productQuery, variables: { id } });
                if (error) throw error;
                return filterByFragment<GQLProductFormRHFFragment>(productFormFragment, data.product);
            } else {
                return { title: "", price: NaN, category: null, statistics: null };
            }
        },
        */

        values: defaultValues,
        resetOptions: {
            keepDirtyValues: true,
        },
    });
    const { control } = form;

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }
    if (error) throw error;

    const onSubmit: SubmitHandler<FormValues> = async (formValues) => {
        console.log("Submit", formValues);

        const output = { ...formValues, category: formValues.category ? formValues.category.id : null };

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

        console.log("Submit timeout done");
    };

    const values = form.watch();
    const isLoading = form.formState.isLoading;
    const isDirty = form.formState.isDirty;
    const touchedFields = form.formState.touchedFields;
    const dirtyFields = form.formState.dirtyFields;

    return (
        <RHFForm onSubmit={onSubmit} {...form}>
            {isLoading && <Typography>Form is loading</Typography>}
            {isDirty && <Typography>Form is dirty</Typography>}
            <p>touchedFields: {JSON.stringify(touchedFields)}</p>
            <p>dirtyFields: {JSON.stringify(dirtyFields)}</p>
            <RHFTextField
                control={control}
                name="title"
                rules={{
                    required: true,
                }}
                label="Title"
                variant="horizontal"
            />
            <RHFNumberField
                control={control}
                name="price"
                rules={{
                    required: true,
                }}
                label="Price"
                decimals={2}
                variant="horizontal"
            />
            <RHFNumberField
                control={control}
                name="statistics.views"
                rules={{
                    required: true,
                }}
                label="Views"
                variant="horizontal"
            />
            <RHFSelect
                control={control}
                name="category"
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
        </RHFForm>
    );
}
