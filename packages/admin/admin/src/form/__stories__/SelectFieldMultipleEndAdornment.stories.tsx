import { Box, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { PropsWithChildren } from "react";

import { FinalForm } from "../../FinalForm";
import { SelectField } from "../../form/fields/SelectField";
import { Field } from "../Field";
import { FinalFormSelect } from "../FinalFormSelect";

/**
 * Layout regression test for the end adornment of a SelectField / FinalFormSelect.
 *
 * The clear button and dropdown icon must stay at the right edge of the field and the selected value(s) must never
 * render underneath them – regardless of how long the selected labels are and which adornments (clear button,
 * error icon) are rendered. Use the container-width control to test different widths.
 */
const config: Meta = {
    title: "components/form/SelectField/MultipleEndAdornment",
    argTypes: {
        containerWidth: {
            control: { type: "range", min: 200, max: 1000, step: 5 },
            description: "Container width in px",
        },
    },
    args: {
        containerWidth: 505,
    },
};
export default config;

interface Option {
    label: string;
    value: string;
}

const longOption: Option = { label: "Supercalifragilisticexpialidocious Chocolate Ice Cream", value: "long" };
const smallOptions: Option[] = [
    { label: "Chocolate", value: "chocolate" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Vanilla", value: "vanilla" },
];
const manyOptions: Option[] = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Date", value: "date" },
    { label: "Elderberry", value: "elderberry" },
    { label: "Fig", value: "fig" },
    { label: "Grape", value: "grape" },
    { label: "Honeydew", value: "honeydew" },
];
const allOptions: Option[] = [longOption, ...smallOptions, ...manyOptions];

const Case = ({ label, children }: PropsWithChildren<{ label: string }>) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {label}
            </Typography>
            {children}
        </Box>
    );
};

interface MultiSelectProps {
    initialValues: Option[];
    required?: boolean;
    disabled?: boolean;
    loadingError?: Error | null;
}

const MultiSelect = ({ initialValues, required, disabled, loadingError }: MultiSelectProps) => {
    return (
        <FinalForm
            mode="edit"
            initialValues={{ field: initialValues }}
            onSubmit={() => {
                // not handled
            }}
        >
            {() => (
                <Field
                    component={FinalFormSelect}
                    multiple
                    name="field"
                    options={allOptions}
                    getOptionLabel={(option: Option) => option.label}
                    getOptionValue={(option: Option) => option.value}
                    fullWidth
                    required={required}
                    disabled={disabled}
                    loadingError={loadingError ?? null}
                />
            )}
        </FinalForm>
    );
};

const SingleSelect = ({ initialValue, loadingError }: { initialValue: Option | null; loadingError?: Error | null }) => {
    return (
        <FinalForm
            mode="edit"
            initialValues={{ field: initialValue }}
            onSubmit={() => {
                // not handled
            }}
        >
            {() => (
                <Field
                    component={FinalFormSelect}
                    name="field"
                    options={allOptions}
                    getOptionLabel={(option: Option) => option.label}
                    getOptionValue={(option: Option) => option.value}
                    fullWidth
                    loadingError={loadingError ?? null}
                />
            )}
        </FinalForm>
    );
};

const SelectFieldWithOptions = ({ initialValue }: { initialValue: string | null }) => {
    return (
        <FinalForm
            mode="edit"
            initialValues={{ field: initialValue }}
            onSubmit={() => {
                // not handled
            }}
        >
            {() => <SelectField name="field" fullWidth options={allOptions.map(({ label, value }) => ({ label, value }))} />}
        </FinalForm>
    );
};

export const AllCases: StoryObj<{ containerWidth: number }> = {
    render: ({ containerWidth }) => (
        <Box sx={{ width: containerWidth, p: 2, border: "1px dashed #ccc" }}>
            <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
                Container width: {containerWidth}px
            </Typography>

            <Case label="Case 1: One long value (multiple)">
                <MultiSelect initialValues={[longOption]} />
            </Case>

            <Case label="Case 2: Multiple values filling the row">
                <MultiSelect initialValues={smallOptions} />
            </Case>

            <Case label="Case 3: Many values (long joined text)">
                <MultiSelect initialValues={manyOptions} />
            </Case>

            <Case label="Case 4: Required (no clear button) with long value">
                <MultiSelect initialValues={[longOption]} required />
            </Case>

            <Case label="Case 5: Empty (no values)">
                <MultiSelect initialValues={[]} />
            </Case>

            <Case label="Case 6: Disabled with many values">
                <MultiSelect initialValues={manyOptions} disabled />
            </Case>

            <Case label="Case 7: Error + clear button (all adornment slots populated)">
                <MultiSelect initialValues={smallOptions} loadingError={new Error("Failed to load")} />
            </Case>

            <Case label="Case 8: Single-select with long value">
                <SingleSelect initialValue={longOption} />
            </Case>

            <Case label="Case 9: Single-select with error + clear button">
                <SingleSelect initialValue={longOption} loadingError={new Error("Failed to load")} />
            </Case>

            <Case label="Case 10: SelectField with options (children path), long value">
                <SelectFieldWithOptions initialValue={longOption.value} />
            </Case>
        </Box>
    ),
};
