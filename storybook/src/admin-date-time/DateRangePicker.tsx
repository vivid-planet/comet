import { Field } from "@comet/admin";
import { DateRange, FinalFormDateRangePicker } from "@comet/admin-date-time";
import { Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const Story = () => {
    interface Values {
        dateRangeOne?: DateRange | null;
        dateRangeTwo?: DateRange | null;
    }

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const initialValues: Partial<Values> = {
        dateRangeOne: null,
        dateRangeTwo: { start: today, end: tomorrow },
    };

    return (
        <div style={{ width: 500 }}>
            <Form<Values> onSubmit={() => {}} initialValues={initialValues}>
                {({ values, form: { change } }) => (
                    <form>
                        <Card>
                            <CardContent>
                                <Field name="dateRangeOne" label="Date range" fullWidth component={FinalFormDateRangePicker} />
                                <Field name="dateRangeTwo" label="Clearable" fullWidth clearable component={FinalFormDateRangePicker} />
                            </CardContent>
                        </Card>
                        <pre>{JSON.stringify(values, null, 4)}</pre>
                    </form>
                )}
            </Form>
        </div>
    );
};

storiesOf("@comet/admin-date-time", module).add("Date Range Picker", () => <Story />);
