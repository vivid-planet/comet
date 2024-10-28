import { Field } from "@comet/admin";
import { DateRange, FinalFormDateRangePicker } from "@comet/admin-date-time";
import { Card, CardContent } from "@mui/material";
import * as React from "react";
import { Form } from "react-final-form";

const Story = () => {
    interface Values {
        dateRangeOne: DateRange;
        dateRangeTwo: DateRange;
    }

    return (
        <div style={{ width: 500 }}>
            <Form<Values>
                onSubmit={() => {}}
                initialValues={{
                    dateRangeTwo: { start: "2024-02-10", end: "2024-02-20" },
                }}
            >
                {({ values }) => (
                    <form>
                        <Card>
                            <CardContent>
                                <Field name="dateRangeOne" label="Date range" fullWidth component={FinalFormDateRangePicker} />
                                <Field name="dateRangeTwo" label="Required" fullWidth required component={FinalFormDateRangePicker} />
                            </CardContent>
                        </Card>
                        <pre>{JSON.stringify(values, null, 4)}</pre>
                    </form>
                )}
            </Form>
        </div>
    );
};

export default {
    title: "@comet/admin-date-time",
};

export const DateRangePicker = () => <Story />;
