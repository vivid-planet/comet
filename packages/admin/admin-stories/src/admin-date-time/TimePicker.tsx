import { Field } from "@comet/admin";
import { FinalFormTimePicker } from "@comet/admin-date-time";
import { Time } from "@comet/admin-icons";
import { Card, CardContent, InputAdornment } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const Story = () => {
    interface Values {
        timeOne?: string;
        timeTwo?: string;
    }

    const initialValues: Partial<Values> = {
        timeOne: undefined,
        timeTwo: "11:30",
    };

    return (
        <div style={{ width: 500 }}>
            <Form<Values> onSubmit={() => {}} initialValues={initialValues}>
                {({ values, form: { change } }) => (
                    <form>
                        <Card>
                            <CardContent>
                                <Field name="timeOne" label="Time" fullWidth component={FinalFormTimePicker} />
                                <Field
                                    name="timeTwo"
                                    label="Clearable time with icon"
                                    fullWidth
                                    clearable
                                    component={FinalFormTimePicker}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Time />
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

storiesOf("@comet/admin-date-time", module).add("Time Picker", () => <Story />);
