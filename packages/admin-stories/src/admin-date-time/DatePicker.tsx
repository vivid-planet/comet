import { ClearInputButton, Field } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { Calendar } from "@comet/admin-icons";
import { Card, CardContent, InputAdornment } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const Story = () => {
    interface Values {
        dateOne?: Date | null;
        dateTwo?: Date | null;
    }

    const initialValues: Partial<Values> = {
        dateOne: null,
        dateTwo: new Date(),
    };

    return (
        <div style={{ width: 500 }}>
            <Form<Values> onSubmit={() => {}} initialValues={initialValues}>
                {({ values, form: { change } }) => (
                    <form>
                        <Card>
                            <CardContent>
                                <Field name="dateOne" label="Date" fullWidth component={FinalFormDatePicker} />
                                <Field
                                    name="dateTwo"
                                    label="Date with icon and clear-button"
                                    fullWidth
                                    component={FinalFormDatePicker}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Calendar />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <ClearInputButton onClick={() => change("dateTwo", null)} />
                                        </InputAdornment>
                                    }
                                />
                            </CardContent>
                        </Card>
                        <pre>{JSON.stringify(values, null, 4)}</pre>
                    </form>
                )}
            </Form>
        </div>
    );
};

storiesOf("@comet/admin-date-time", module).add("Date Picker", () => <Story />);
