import { inputLabelClasses } from "@mui/material";
import {
    getGridDateOperators,
    getGridStringOperators,
    type GridColTypeDef,
    GridFilterInputValue,
    type GridFilterInputValueProps,
} from "@mui/x-data-grid";
import { DateTimePicker } from "@mui/x-date-pickers";
import { format, parse } from "date-fns";
import { useState } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";

<<<<<<< HEAD
import { DatePicker } from "../dateTime/DatePicker";
=======
import { Future_DatePicker as DatePicker } from "../dateTime/datePicker/DatePicker";
>>>>>>> main

const dateFormat = "yyyy-MM-dd";
const dateTimeFormat = "yyyy-MM-dd HH:mm:ss";

const DatePickerFilter = ({ item, applyValue }: GridFilterInputValueProps) => {
    const [internalValue, setInternalValue] = useState<string | undefined>(item.value);

    return (
        <DatePicker
            value={internalValue}
            onChange={(newValue: string | undefined) => {
                setInternalValue(newValue);
            }}
            onAccept={(newValue: Date | null) => {
                const stringValue = newValue ? format(newValue, dateFormat) : null;
                applyValue({ ...item, value: stringValue });
            }}
            slotProps={{
                root: {
                    sx: {
                        [`& .${inputLabelClasses.root}`]: {
                            // Render the label normally as no `FieldContainer` is used here to be consistent with other inputs in the datagrid filters
                            display: "block",
                        },
                    },
                    slotProps: {
                        textField: {
                            label: <FormattedMessage id="dataGrid.filterOperator.date.label" defaultMessage="Value" />,
                            onBlur: () => {
                                applyValue({ ...item, value: internalValue });
                            },
                        },
                    },
                },
            }}
        />
    );
};

export const dataGridDateColumn: GridColTypeDef = {
    type: "date",
    valueGetter: (value) => value && new Date(value),
    renderCell: ({ value }) => value && <FormattedDate value={value} dateStyle="medium" />,
    filterOperators: getGridDateOperators().map((operator) => {
        if (!operator.InputComponent) {
            // Skip operators that do not have an InputComponent, e.g., "isEmpty" or "isNotEmpty"
            return operator;
        }

        return {
            ...operator,
            InputComponent: DatePickerFilter,
        };
    }),
};

const DateTimePickerFilter = ({ item, applyValue }: GridFilterInputValueProps) => {
    const dateValue = item.value ? parse(item.value, dateTimeFormat, new Date()) : null;
    const [internalValue, setInternalValue] = useState<Date | null>(dateValue);

    const applyDateValue = (newValue: Date | null) => {
        const stringValue = newValue ? format(newValue, dateTimeFormat) : null;
        applyValue({ ...item, value: stringValue });
    };

    return (
        <DateTimePicker
            value={internalValue}
            label={<FormattedMessage id="dataGrid.filterOperator.dateTime.label" defaultMessage="Value" />}
            onChange={(newValue: Date | null) => {
                setInternalValue(newValue);
            }}
            onAccept={(newValue: Date | null) => {
                applyDateValue(newValue);
            }}
            slotProps={{
                textField: {
                    variant: "standard",
                    size: "small",
                    fullWidth: true,
                    InputProps: {
                        disableUnderline: true,
                    },
                    onBlur: () => {
                        applyDateValue(internalValue);
                    },
                },
            }}
        />
    );
};

export const dataGridDateTimeColumn: GridColTypeDef = {
    type: "dateTime",
    valueGetter: (value) => value && new Date(value),
    renderCell: ({ value }) => value && <FormattedDate value={value} dateStyle="medium" timeStyle="short" />,
    filterOperators: getGridDateOperators().map((operator) => {
        if (!operator.InputComponent) {
            // Skip operators that do not have an InputComponent, e.g., "isEmpty" or "isNotEmpty"
            return operator;
        }

        return {
            ...operator,
            InputComponent: DateTimePickerFilter,
        };
    }),
};

/**
 * Data Grid column definition for ID columns.
 * Sets `filterOperators` to match the `IdFilter` GraphQL input type.
 */
export const dataGridIdColumn: GridColTypeDef = {
    filterOperators: getGridStringOperators().filter((operator) => ["isAnyOf", "equals", "doesNotEqual"].includes(operator.value)),
};

/*
 * Data Grid column definition for many-to-many columns.
 * Sets `filterOperators` to match the `ManyToManyFilter` GraphQL input type.
 */
export const dataGridManyToManyColumn: GridColTypeDef = {
    filterOperators: [
        {
            value: "search",
            getApplyFilterFn: () => {
                throw new Error("not implemented, we filter server side");
            },
            InputComponent: GridFilterInputValue,
        },
    ],
};

/*
 * Data Grid column definition for one-to-many columns.
 * Sets `filterOperators` to match the `OneToManyFilter` GraphQL input type.
 */
export const dataGridOneToManyColumn: GridColTypeDef = {
    filterOperators: [
        {
            value: "search",
            getApplyFilterFn: () => {
                throw new Error("not implemented, we filter server side");
            },
            InputComponent: GridFilterInputValue,
        },
    ],
};
