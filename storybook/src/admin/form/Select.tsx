import { Field, FieldSet, FinalFormSelect, SelectField, SelectFieldOption } from "@comet/admin";
import { Account } from "@comet/admin-icons";
import { Box, Checkbox, InputAdornment, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const options: SelectFieldOption[] = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "raspberry", label: "Raspberry" },
        { value: "vanilla", label: "Vanilla", disabled: true },
        { value: "mango", label: "Mango" },
    ];

    const numberOptions: SelectFieldOption[] = [
        { value: 0, label: "Zero" },
        { value: 1, label: "One" },
        { value: 2, label: "Two" },
        { value: 3, label: "Three" },
        { value: 4, label: "Four", disabled: true },
        { value: 5, label: "Five" },
    ];

    return (
        <Box width={500}>
            <Form
                initialValues={{
                    multipleFlavors: [],
                    multipleNumbers: [],
                    multipleRequiredFlavors: [],
                }}
                onSubmit={() => {
                    //
                }}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <FieldSet title="Basic selects">
                            <SelectField name="flavor" label="Select a flavor" options={options} fullWidth />
                            <SelectField name="number" label="Select a number" options={numberOptions} fullWidth />
                            <Box component="pre">{JSON.stringify({ flavor: values.flavor, number: values.number }, null, 2)}</Box>
                        </FieldSet>

                        <FieldSet title="Multi selects">
                            <SelectField name="multipleFlavors" label="Select multiple flavors" options={options} multiple fullWidth />
                            <SelectField name="multipleNumbers" label="Select multiple numbers" options={numberOptions} multiple fullWidth />
                            <Box component="pre">
                                {JSON.stringify({ multipleFlavors: values.multipleFlavors, multipleNumbers: values.multipleNumbers }, null, 2)}
                            </Box>
                        </FieldSet>

                        <FieldSet title="Required selects">
                            <SelectField name="requiredFlavor" label="Select a flavor" options={options} fullWidth required />
                            <SelectField name="requiredNumber" label="Select a number" options={numberOptions} fullWidth required />
                            <SelectField
                                name="multipleRequiredFlavors"
                                label="Select multiple flavors"
                                options={options}
                                multiple
                                fullWidth
                                required
                            />
                            <Box component="pre">
                                {JSON.stringify(
                                    {
                                        requiredFlavor: values.requiredFlavor,
                                        requiredNumber: values.requiredNumber,
                                        multipleRequiredFlavors: values.multipleRequiredFlavors,
                                    },
                                    null,
                                    2,
                                )}
                            </Box>
                        </FieldSet>

                        <FieldSet title="Customization">
                            {/* TODO: Make this work with SelectField */}
                            <Field name="flavorMultipleAdornments" label="Flavor with adornments" fullWidth>
                                {(props) => (
                                    <FinalFormSelect
                                        {...props}
                                        fullWidth
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Account />
                                            </InputAdornment>
                                        }
                                    >
                                        {options.map((option) => (
                                            <MenuItem value={option.value} key={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </FinalFormSelect>
                                )}
                            </Field>

                            {/* TODO: Make this work with SelectField */}
                            <Field name="flavorWithCustomOptionsRendering" label="Flavor with adornments" fullWidth>
                                {(props) => (
                                    <FinalFormSelect
                                        {...props}
                                        renderValue={(value) => options.find((option) => option.value === value)?.label}
                                        fullWidth
                                    >
                                        {options.map((option) => (
                                            <MenuItem value={option.value} key={option.value}>
                                                <Checkbox checked={option.value === values.flavorWithCustomOptionsRendering} />
                                                <ListItemText primary={option.label} secondary={`The value is ${option.value}`} />
                                                <ListItemIcon>
                                                    <Account />
                                                </ListItemIcon>
                                            </MenuItem>
                                        ))}
                                    </FinalFormSelect>
                                )}
                            </Field>

                            <Box component="pre">
                                {JSON.stringify(
                                    {
                                        flavorMultipleAdornments: values.flavorMultipleAdornments,
                                        flavorWithCustomOptionsRendering: values.flavorWithCustomOptionsRendering,
                                    },
                                    null,
                                    2,
                                )}
                            </Box>
                        </FieldSet>
                    </form>
                )}
            />
        </Box>
    );
}

storiesOf("@comet/admin/form", module).add("Select", () => <Story />);
