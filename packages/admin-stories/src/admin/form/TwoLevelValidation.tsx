import { Field, FinalFormInput } from "@comet/admin";
import { Box, Paper } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { FieldValidator } from "final-form";
import setFieldData from "final-form-set-field-data";
import * as React from "react";
import { Form } from "react-final-form";

const validateWarning = (value: number | undefined) => {
    if (value === undefined) {
        return undefined;
    }

    if (value < 10) {
        return "Value should be >= 10";
    }
};

const validateWarningAsync = (value: number | undefined) => {
    return new Promise<string | undefined>((resolve) => {
        setTimeout(() => {
            resolve(validateWarning(value));
        }, 5000);
    });
};

const validateError: FieldValidator<number | undefined> = (value) => {
    if (value === undefined) {
        return undefined;
    }

    if (value < 5) {
        return "Value must be >= 5";
    }
};

function Story() {
    return (
        <div style={{ width: "500px" }}>
            <Form
                onSubmit={() => {}}
                mutators={{ setFieldData }}
                render={({ handleSubmit }) => (
                    <Paper>
                        <Box padding={4}>
                            <form onSubmit={handleSubmit}>
                                <Field
                                    name="input1"
                                    type="number"
                                    label="Required only validation"
                                    placeholder="Must be >= 5, should be >= 10"
                                    component={FinalFormInput}
                                    required
                                    fullWidth
                                />
                                <Field
                                    name="input2"
                                    type="number"
                                    label="Error only validation"
                                    placeholder="Must be >= 5, should be >= 10"
                                    component={FinalFormInput}
                                    required
                                    validate={validateError}
                                    fullWidth
                                />
                                <Field
                                    name="input3"
                                    type="number"
                                    label="Warning only validation"
                                    placeholder="Must be >= 5, should be >= 10"
                                    component={FinalFormInput}
                                    required
                                    validateWarning={validateWarning}
                                    fullWidth
                                />
                                <Field
                                    name="input4"
                                    type="number"
                                    label="Error and warning validation"
                                    placeholder="Must be >= 5, should be >= 10"
                                    component={FinalFormInput}
                                    required
                                    validate={validateError}
                                    validateWarning={validateWarning}
                                    fullWidth
                                />
                                <Field
                                    name="input5"
                                    type="number"
                                    label="Async warning validation"
                                    placeholder="Must be >= 5, should be >= 10"
                                    component={FinalFormInput}
                                    required
                                    validateWarning={validateWarningAsync}
                                    fullWidth
                                />
                            </form>
                        </Box>
                    </Paper>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Two level validation (warning and error)", () => <Story />);
