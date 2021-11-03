import {
    Field,
    FieldContainer,
    FinalFormCheckbox,
    FinalFormInput,
    FinalFormMultiSelect,
    FinalFormRadio,
    FinalFormSearchTextField,
    FinalFormSelect,
    FinalFormSwitch,
} from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import { Box, Button, Card, CardContent, Collapse, FormControlLabel, FormLabel, MenuItem } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];

    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <div style={{ width: "500px" }}>
            <Form
                onSubmit={(values) => {
                    alert(JSON.stringify(values, undefined, 2));
                }}
                initialValues={{ checkbox: false, radio: "foo", switch: false }}
                render={({ handleSubmit, values }) => (
                    <>
                        <Card variant="outlined">
                            <CardContent>
                                <form onSubmit={handleSubmit}>
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
                                    <Box style={{ marginBottom: "10px" }}>
                                        <FormLabel>MultiSelect</FormLabel>
                                        <Box
                                            onClick={() => setOpen(!open)}
                                            style={{
                                                minWidth: "100px",
                                                minHeight: "38px",
                                                border: "1px solid #D9D9D9",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                display: "flex",
                                                padding: "9px 32px 9px 9px",
                                                boxSizing: "border-box",
                                                position: "relative",
                                                borderRadius: "2px",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <Box style={{ lineHeight: "20px" }}>
                                                {values.multiSelect && values.multiSelect.map((value: string) => `${value}, `)}
                                            </Box>
                                            <Box
                                                style={{
                                                    position: "absolute",
                                                    right: "13px",
                                                    top: "13px",
                                                    width: "12px",
                                                    height: "12px",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                <ChevronDown fontSize={"inherit"} />
                                            </Box>
                                        </Box>
                                        <Collapse in={open} style={{ border: "1px solid #D9D9D9", borderRadius: "2px" }}>
                                            <Field name="multiSelect" fullWidth component={FinalFormMultiSelect} options={options} />
                                        </Collapse>
                                    </Box>

                                    <Field name="switch" label="FinalFormSwitch" fullWidth>
                                        {(props) => (
                                            <FormControlLabel label={values.switch ? "On" : "Off"} control={<FinalFormSwitch {...props} />} />
                                        )}
                                    </Field>
                                    <Button color="primary" variant="contained" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                        <div>
                            <pre>{JSON.stringify(values, undefined, 2)}</pre>
                        </div>
                    </>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("AllFieldComponents", () => <Story />);
