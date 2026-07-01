import { AutocompleteField, FinalForm } from "@comet/admin";
import { Box, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Layout regression test for the multi-select end adornment fix.
 * Verifies that:
 * - The clear + chevron icons never wrap below chips
 * - The input is accessible (clicking opens the dropdown) in all scenarios
 * Use the container-width slider to test at different widths.
 */
const meta: Meta = {
    title: "@comet/admin/form/AutocompleteField/MultipleEndAdornmentLayout",
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
export default meta;

type Option = { label: string; value: string };

const longChip: Option = { label: "Supercalifragilisticexpialidocious Chocolate Ice Cream", value: "long" };
const smallChips: Option[] = [
    { label: "Chocolate", value: "chocolate" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Vanilla", value: "vanilla" },
];
const manyChips: Option[] = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Date", value: "date" },
    { label: "Elderberry", value: "elderberry" },
    { label: "Fig", value: "fig" },
    { label: "Grape", value: "grape" },
    { label: "Honeydew", value: "honeydew" },
];
const allOptions: Option[] = [longChip, ...smallChips, ...manyChips];

function Case({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {label}
            </Typography>
            {children}
        </Box>
    );
}

function MultiField({
    initialValues,
    required,
    loading,
    loadingError,
}: {
    initialValues: Option[];
    required?: boolean;
    loading?: boolean;
    loadingError?: Error | null;
}) {
    return (
        <FinalForm
            mode="edit"
            initialValues={{ field: initialValues }}
            onSubmit={() => {
                // not handled
            }}
        >
            {() => (
                <AutocompleteField<Option, true, false, false>
                    name="field"
                    multiple
                    options={allOptions}
                    getOptionLabel={(o) => o.label}
                    isOptionEqualToValue={(o, v) => o.value === v.value}
                    fullWidth
                    required={required}
                    loading={loading}
                    loadingError={loadingError ?? null}
                />
            )}
        </FinalForm>
    );
}

function SingleField({ initialValue }: { initialValue: Option | null }) {
    return (
        <FinalForm
            mode="edit"
            initialValues={{ field: initialValue }}
            onSubmit={() => {
                // not handled
            }}
        >
            {() => (
                <AutocompleteField<Option, false, false, false>
                    name="field"
                    options={allOptions}
                    getOptionLabel={(o) => o.label}
                    isOptionEqualToValue={(o, v) => o.value === v.value}
                    fullWidth
                />
            )}
        </FinalForm>
    );
}

export const AllCases: StoryObj<{ containerWidth: number }> = {
    render: ({ containerWidth }: { containerWidth: number }) => (
        <Box sx={{ width: containerWidth, p: 2, border: "1px dashed #ccc" }}>
            <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
                Container width: {containerWidth}px
            </Typography>

            <Case label="Case 1: One long chip">
                <MultiField initialValues={[longChip]} />
            </Case>

            <Case label="Case 2: Multiple small chips filling the row">
                <MultiField initialValues={smallChips} />
            </Case>

            <Case label="Case 3: Many chips wrapping to several rows">
                <MultiField initialValues={manyChips} />
            </Case>

            <Case label="Case 4: Mixed long + short chip">
                <MultiField initialValues={[longChip, { label: "Vanilla", value: "vanilla" }]} />
            </Case>

            <Case label="Case 5: Required (no clear button) with long chip">
                <MultiField initialValues={[longChip]} required />
            </Case>

            <Case label="Case 6: Empty (no chips)">
                <MultiField initialValues={[]} />
            </Case>

            <Case label="Case 7: Single-select with long value">
                <SingleField initialValue={longChip} />
            </Case>

            <Case label="Case 8: All end-adornment slots populated (loading + error + clear + popup)">
                <MultiField initialValues={smallChips} loading loadingError={new Error("Failed to load")} />
            </Case>
        </Box>
    ),
};
