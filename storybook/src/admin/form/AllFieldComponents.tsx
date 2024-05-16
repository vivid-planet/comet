import {
    CheckboxField,
    CurrencyField,
    Field,
    FieldContainer,
    FinalFormCheckbox,
    FinalFormInput,
    FinalFormRadio,
    FinalFormSearchTextField,
    FinalFormSelect,
    FinalFormSwitch,
    SearchField,
    SelectField,
    SwitchField,
    TextAreaField,
    TextField,
} from "@comet/admin";
import { ColorField } from "@comet/admin-color-picker";
import { DateField, DateRangeField, DateTimeField, TimeField, TimeRangeField } from "@comet/admin-date-time";
import { Button, Card, CardContent, CardHeader, FormControlLabel, Grid, Link, MenuItem } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];

    return (
        <Form
            onSubmit={(values) => {
                alert(JSON.stringify(values, undefined, 2));
            }}
            initialValues={{ multiSelect: [] }}
            render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <Grid container mb={2} spacing={2}>
                        <Grid item md={6}>
                            <Card variant="outlined">
                                <CardHeader title="Common Field-Components" titleTypographyProps={{ variant: "h3" }} />
                                <CardContent>
                                    <TextField name="text" label="Text" fullWidth />
                                    <TextAreaField name="textarea" label="TextArea" fullWidth />
                                    <SearchField name="search" label="Search" fullWidth />
                                    <SelectField name="select" label="Select" fullWidth>
                                        {options.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </SelectField>
                                    <CurrencyField name="currency" label="Currency" fullwidth />
                                    <CheckboxField
                                        name="singleCheckboxWithLink"
                                        label={
                                            <>
                                                Single checkbox with a{" "}
                                                <Link href="https://www.comet-dxp.com" target="_blank">
                                                    link
                                                </Link>{" "}
                                                inside the label.
                                            </>
                                        }
                                        fullWidth
                                    />
                                    <SwitchField name="switch" label={values.switch ? "On" : "Off"} fieldLabel="Switch" />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item md={6}>
                            <Card variant="outlined">
                                <CardHeader title="Special Field-Components" titleTypographyProps={{ variant: "h3" }} />
                                <CardContent>
                                    <DateField name="date" label="Date" fullWidth />
                                    <DateRangeField name="dateRange" label="Date Range" fullWidth />
                                    <TimeField name="time" label="Time" fullWidth />
                                    <TimeRangeField name="timeRange" label="Time Range" fullWidth />
                                    <DateTimeField name="dateTime" label="Date Time" fullWidth />
                                    <ColorField name="hexColor" label="Color (hex)" fullWidth />
                                    <ColorField name="rgbaColor" label="Color (rgba)" colorFormat="rgba" fullWidth />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item md={6}>
                            <Card variant="outlined">
                                <CardHeader title="Field & FinalForm-Components" titleTypographyProps={{ variant: "h3" }} />
                                <CardContent>
                                    <Field name="input" label="FinalFormInput" fullWidth component={FinalFormInput} />
                                    <Field name="search" label="FinalFormSearchTextField" component={FinalFormSearchTextField} />
                                    <Field
                                        name="text"
                                        label="FinalFormInput (multiline)"
                                        multiline
                                        rows={3}
                                        rowsMax={5}
                                        fullWidth
                                        component={FinalFormInput}
                                    />
                                    <Field name="checkbox" type="checkbox" fullWidth>
                                        {(props) => <FormControlLabel label="FinalFormCheckbox" control={<FinalFormCheckbox {...props} />} />}
                                    </Field>
                                    <FieldContainer label="FinalFormRadio" fullWidth>
                                        <Field name="radio" type="radio" value="foo">
                                            {(props) => <FormControlLabel label="Foo" control={<FinalFormRadio {...props} />} />}
                                        </Field>
                                        <Field name="radio" type="radio" value="bar">
                                            {(props) => <FormControlLabel label="Bar" control={<FinalFormRadio {...props} />} />}
                                        </Field>
                                    </FieldContainer>
                                    <Field name="select" label="FinalFormSelect" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props}>
                                                {options.map((option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>
                                    <Field name="switch" label="FinalFormSwitch" fullWidth>
                                        {(props) => (
                                            <FormControlLabel label={values.switch ? "On" : "Off"} control={<FinalFormSwitch {...props} />} />
                                        )}
                                    </Field>
                                    <Button color="primary" variant="contained" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <pre>{JSON.stringify(values, undefined, 2)}</pre>
                </form>
            )}
        />
    );
}

storiesOf("@comet/admin/form", module).add("AllFieldComponents", () => <Story />);
