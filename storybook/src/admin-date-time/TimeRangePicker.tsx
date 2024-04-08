import { Field } from "@comet/admin";
import { FinalFormTimeRangePicker, TimeRange } from "@comet/admin-date-time";
import { Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const Story = () => {
    interface Values {
        timeRangeOne?: TimeRange;
        timeRangeTwo?: TimeRange;
    }

    const initialValues: Partial<Values> = {
        timeRangeOne: undefined,
        timeRangeTwo: {
            start: "11:30",
            end: "12:30",
        },
    };

    return (
        <div style={{ width: 500 }}>
            <Form<Values> onSubmit={() => {}} initialValues={initialValues}>
                {({ values }) => (
                    <form>
                        <Card>
                            <CardContent>
                                <Field name="timeRangeOne" label="Time range" fullWidth component={FinalFormTimeRangePicker} />
                                <Field name="timeRangeTwo" label="Clearable" fullWidth clearable component={FinalFormTimeRangePicker} />
                            </CardContent>
                        </Card>
                        <pre>{JSON.stringify(values, null, 4)}</pre>
                    </form>
                )}
            </Form>
        </div>
    );
};

storiesOf("@comet/admin-date-time", module).add("Time Range Picker", () => <Story />);
