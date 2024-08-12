import { Field, FieldContainer } from "@comet/admin";
import { DateRange, DateRangePicker, FinalFormDateRangePicker } from "@comet/admin-date-time";
import { Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/form/components/Date & Time Pickers/Date-Range Picker", module)
    .add("Basic", () => {
        const [dateOne, setDateOne] = React.useState<DateRange | undefined>();
        const [dateTwo, setDateTwo] = React.useState<DateRange | undefined>({ start: "2024-03-10", end: "2024-03-16" });
        const [dateThree, setDateThree] = React.useState<DateRange | undefined>({ start: "2024-03-10", end: "2024-03-16" });

        return (
            <Grid container spacing={4}>
                <Grid item xs={6} md={4}>
                    <FieldContainer label="Date-Range Picker" fullWidth>
                        <DateRangePicker fullWidth value={dateOne} onChange={setDateOne} />
                    </FieldContainer>
                </Grid>
                <Grid item xs={6} md={4}>
                    <FieldContainer label="Required" fullWidth required>
                        <DateRangePicker fullWidth value={dateTwo} onChange={setDateTwo} required />
                    </FieldContainer>
                </Grid>
                <Grid item xs={6} md={4}>
                    <FieldContainer label="Formatted date" fullWidth>
                        <DateRangePicker
                            fullWidth
                            value={dateThree}
                            onChange={setDateThree}
                            formatDateOptions={{ month: "short", day: "numeric", year: "numeric" }}
                        />
                    </FieldContainer>
                </Grid>
            </Grid>
        );
    })
    .add("Final Form", () => {
        type Values = {
            dateOne?: DateRange;
            dateTwo?: DateRange;
            dateThree?: DateRange;
        };

        return (
            <Form<Values>
                initialValues={{ dateTwo: { start: "2024-03-10", end: "2024-03-16" }, dateThree: { start: "2024-03-10", end: "2024-03-16" } }}
                onSubmit={() => {}}
            >
                {() => (
                    <Grid container spacing={4}>
                        <Grid item xs={6} md={4}>
                            <Field name="dateOne" label="Date-Range Picker" fullWidth component={FinalFormDateRangePicker} />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Field name="dateTwo" label="Required" fullWidth component={FinalFormDateRangePicker} required />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Field
                                name="dateThree"
                                label="Formatted date"
                                fullWidth
                                component={FinalFormDateRangePicker}
                                formatDateOptions={{ month: "short", day: "numeric", year: "numeric" }}
                            />
                        </Grid>
                    </Grid>
                )}
            </Form>
        );
    });
