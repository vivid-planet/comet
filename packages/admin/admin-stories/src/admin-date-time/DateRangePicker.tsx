import { ClearInputButton, Field } from "@comet/admin";
import { DateRange, FinalFormDateRangePicker } from "@comet/admin-date-time";
import { Calendar } from "@comet/admin-icons";
import { Card, CardContent, InputAdornment } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const Story = () => {
    interface Values {
        dateRangeOne?: DateRange | null;
        dateRangeTwo?: DateRange | null;
    }

    const initialValues: Partial<Values> = {
        dateRangeOne: null,
        dateRangeTwo: { start: new Date(), end: new Date() },
    };

    return (
        <div style={{ width: 500 }}>
            <Form<Values> onSubmit={() => {}} initialValues={initialValues}>
                {({ values, form: { change } }) => (
                    <form>
                        <Card>
                            <CardContent>
                                <Field name="dateRangeOne" label="Date range" fullWidth component={FinalFormDateRangePicker} />
                                <Field
                                    name="dateRangeTwo"
                                    label="Date range with icon and clear-button"
                                    fullWidth
                                    component={FinalFormDateRangePicker}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Calendar />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <ClearInputButton onClick={() => change("dateRangeTwo", null)} />
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

storiesOf("@comet/admin-date-time", module).add("Date Range Picker", () => <Story />);
