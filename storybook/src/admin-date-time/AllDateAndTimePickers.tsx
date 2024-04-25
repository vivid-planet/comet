import { DateField, DateRange, DateRangeField, DateTimeField, TimeField, TimeRange, TimeRangeField } from "@comet/admin-date-time";
import { Box, Card, CardContent } from "@mui/material";
import { boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const Story = () => {
    type FormValues = {
        date: string;
        dateRange: DateRange;
        dateTime: Date;
        time: string;
        timeRange: TimeRange;
    };

    return (
        <Box width={550}>
            <Form<FormValues>
                onSubmit={() => {}}
                initialValues={
                    boolean("Show Initial Values", false)
                        ? {
                              date: "2024-03-01",
                              dateRange: {
                                  start: "2024-03-01",
                                  end: "2024-03-05",
                              },
                              dateTime: new Date(),
                              time: "11:30",
                              timeRange: {
                                  start: "11:30",
                                  end: "12:30",
                              },
                          }
                        : {}
                }
            >
                {({ values }) => (
                    <form>
                        <Card>
                            <CardContent>
                                <DateField
                                    name="date"
                                    label="Date"
                                    fullWidth
                                    clearable
                                    helperText={`Stringified value: ${JSON.stringify(values.date)}`}
                                />
                                <DateRangeField
                                    name="dateRange"
                                    label="DateRange"
                                    fullWidth
                                    clearable
                                    helperText={`Stringified value: ${JSON.stringify(values.dateRange)}`}
                                />
                                <DateTimeField
                                    name="dateTime"
                                    label="DateTime"
                                    fullWidth
                                    clearable
                                    helperText={`Stringified value: ${JSON.stringify(values.dateTime)}`}
                                />
                                <TimeField
                                    name="time"
                                    label="Time"
                                    fullWidth
                                    clearable
                                    helperText={`Stringified value: ${JSON.stringify(values.time)}`}
                                />
                                <TimeRangeField
                                    name="timeRange"
                                    label="TimeRange"
                                    fullWidth
                                    clearable
                                    helperText={`Stringified value: ${JSON.stringify(values.timeRange)}`}
                                />
                            </CardContent>
                        </Card>
                    </form>
                )}
            </Form>
        </Box>
    );
};

storiesOf("@comet/admin-date-time", module).add("All Pickers", () => <Story />);
