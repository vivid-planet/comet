import {
    AsyncAutocompleteField,
    AsyncSelectField,
    AutocompleteField,
    CheckboxField,
    FieldContainer,
    FieldSet,
    NumberField,
    RadioField,
    SearchField,
    SelectField,
    SwitchField,
    TextAreaField,
    TextField,
} from "@comet/admin";
import { ColorField } from "@comet/admin-color-picker";
import { DateField, DateRangeField, DateTimeField, TimeField, TimeRangeField } from "@comet/admin-date-time";
import { Box, Button, Link, MenuItem } from "@mui/material";
import { select } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const fieldVariant = select(
        "Field variant",
        {
            Horizontal: "horizontal",
            Vertical: "vertical",
        },
        "horizontal",
    );

    type Option = { value: string; label: string };

    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];

    const initalValues = React.useMemo(() => ({ multiSelect: [] }), []);

    return (
        <Form
            onSubmit={(values) => {
                alert(JSON.stringify(values, undefined, 2));
            }}
            initialValues={initalValues}
            render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <Box maxWidth={1024}>
                        <FieldSet title="Common Field-Components">
                            <TextField name="text" label="Text" variant={fieldVariant} fullWidth />
                            <TextAreaField name="textarea" label="TextArea" variant={fieldVariant} fullWidth />
                            <SearchField name="search" label="Search" variant={fieldVariant} fullWidth />
                            <SelectField name="select" label="Select" variant={fieldVariant} fullWidth>
                                {options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </SelectField>
                            <NumberField name="number" label="Number" variant={fieldVariant} fullWidth />
                            <AsyncSelectField
                                name="asyncSelect"
                                label="Async Select"
                                loadOptions={async () => {
                                    return new Promise<typeof options>((resolve) => setTimeout(() => resolve(options), 1000));
                                }}
                                getOptionLabel={(option) => option.label}
                                variant={fieldVariant}
                                fullWidth
                            />
                            <AutocompleteField
                                name="autocomplete"
                                label="Autocomplete"
                                options={options}
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                variant={fieldVariant}
                                fullWidth
                            />
                            <AsyncAutocompleteField
                                name="asyncAutocomplete"
                                label="Async Autocomplete"
                                loadOptions={async () => {
                                    return new Promise<typeof options>((resolve) => setTimeout(() => resolve(options), 1000));
                                }}
                                getOptionLabel={(option: Option) => option.label}
                                isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
                                variant={fieldVariant}
                                fullWidth
                            />
                        </FieldSet>
                        <FieldSet title="Field-Components with Field-Container">
                            <CheckboxField name="singleCheckbox" fieldLabel="Single Checkbox" variant={fieldVariant} fullWidth />
                            <CheckboxField
                                name="checkboxWithAdditionalLabel"
                                fieldLabel="Checkbox with additional label"
                                label={
                                    <>
                                        This label has a{" "}
                                        <Link href="https://www.comet-dxp.com" target="_blank">
                                            link
                                        </Link>{" "}
                                        inside of it.
                                    </>
                                }
                                variant={fieldVariant}
                                fullWidth
                            />
                            <CheckboxField name="checkboxWithoutFieldLabel" label="Checkbox without a field label" variant={fieldVariant} fullWidth />
                            <FieldContainer label="Checkbox list" variant={fieldVariant} fullWidth>
                                <CheckboxField name="checkboxList" label="Checkbox one" value="checkbox-one" />
                                <CheckboxField name="checkboxList" label="Checkbox two" value="checkbox-two" />
                                <CheckboxField name="checkboxList" label="Checkbox three" value="checkbox-three" />
                                <CheckboxField name="checkboxList" label="Checkbox four" value="checkbox-four" />
                                <CheckboxField name="checkboxList" label="Checkbox five" value="checkbox-five" />
                            </FieldContainer>
                            <SwitchField name="switch" label={values.switch ? "On" : "Off"} fieldLabel="Switch" variant={fieldVariant} />
                            <FieldContainer label="Radio" variant={fieldVariant} fullWidth>
                                <RadioField name="radio" label="Option One" value="option-one" />
                                <RadioField name="radio" label="Option Two" value="option-two" />
                            </FieldContainer>
                            <FieldContainer label="Radio (many options)" variant={fieldVariant} fullWidth>
                                <RadioField name="radioManyOptions" label="Option One" value="option-one" />
                                <RadioField name="radioManyOptions" label="Option Two" value="option-two" />
                                <RadioField name="radioManyOptions" label="Option Three" value="option-three" />
                                <RadioField name="radioManyOptions" label="Option Four" value="option-four" />
                                <RadioField name="radioManyOptions" label="Option Five" value="option-five" />
                                <RadioField name="radioManyOptions" label="Option Six" value="option-six" />
                            </FieldContainer>
                        </FieldSet>
                        <FieldSet title="Date and Time" supportText="@comet/admin-date-time">
                            <DateField name="date" label="Date" variant={fieldVariant} fullWidth />
                            <DateRangeField name="dateRange" label="Date Range" variant={fieldVariant} fullWidth />
                            <TimeField name="time" label="Time" variant={fieldVariant} fullWidth />
                            <TimeRangeField name="timeRange" label="Time Range" variant={fieldVariant} fullWidth />
                            <DateTimeField name="dateTime" label="Date Time" variant={fieldVariant} fullWidth />
                        </FieldSet>
                        <FieldSet title="Color" supportText="@comet/admin-color-picker">
                            <ColorField name="hexColor" label="Color (hex)" variant={fieldVariant} fullWidth />
                            <ColorField name="rgbaColor" label="Color (rgba)" colorFormat="rgba" variant={fieldVariant} fullWidth />
                        </FieldSet>
                        <div>
                            <Button color="primary" variant="contained" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </div>
                    </Box>
                    <pre>{JSON.stringify(values, undefined, 2)}</pre>
                </form>
            )}
        />
    );
}

storiesOf("@comet/admin/form", module).add("AllFieldComponents", () => <Story />);
