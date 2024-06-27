import { ChipSelect, ChipSelectField, SelectField } from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import { Card, CardContent, Chip, Divider, MenuItem, Select, Stack, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate Label" },
        { value: "strawberry", label: "Strawberry Label" },
        { value: "vanilla", label: "Vanilla Label" },
    ];

    const [selectValue, setSelectValue] = React.useState<string | undefined>(undefined);

    return (
        <Form
            onSubmit={() => {
                // Do nothing
            }}
            render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                ChipSelectField in FinalForm
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 4 }}>
                                Compared to existing SelectField and MUIs (non-select) Chip
                            </Typography>
                            <SelectField name="select" label="Select">
                                {options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </SelectField>
                            <br />
                            <ChipSelectField name="select" label="Select">
                                {options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </ChipSelectField>
                            <br />
                            <Chip label={options.find((option) => option.value === values.select)?.label} icon={<ChevronDown />} />

                            <Divider sx={{ my: 8 }} />

                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                ChipSelect outside of FinalForm
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 4 }}>
                                Compared to MUIs Select
                            </Typography>

                            <Stack spacing={2}>
                                <Select value={selectValue} onChange={(event) => setSelectValue(event.target.value)}>
                                    {options.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {/* @ts-expect-error `value` does not yet work */}
                                <ChipSelect value={selectValue} onChange={(event) => setSelectValue(event.target.value)}>
                                    {options.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </ChipSelect>
                            </Stack>
                        </CardContent>
                    </Card>
                    <pre>
                        {JSON.stringify(
                            {
                                finalFormSelectValue: values.select,
                                nonFinalFormSelectValue: selectValue,
                            },
                            undefined,
                            2,
                        )}
                    </pre>
                </form>
            )}
        />
    );
}

storiesOf("@comet/admin/form", module).add("Chip Select", () => <Story />);
