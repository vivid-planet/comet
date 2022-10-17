import { Field } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { Card, CardContent } from "@mui/material";
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
                                <Field name="dateTwo" label="Clearable" fullWidth clearable component={FinalFormDatePicker} />
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
