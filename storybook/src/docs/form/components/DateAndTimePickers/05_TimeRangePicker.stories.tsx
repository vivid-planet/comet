import { Field, FieldContainer } from "@comet/admin";
import { FinalFormTimeRangePicker, TimeRange, TimeRangePicker } from "@comet/admin-date-time";
import { Grid } from "@mui/material";
import { useState } from "react";
import { Form } from "react-final-form";

export default {
    title: "Docs/Form/Components/Date & Time Pickers/Time-Range Picker",
};

export const Basic = () => {
    const [timeRangeOne, setTimeRangeOne] = useState<TimeRange | undefined>();
    const [timeRangeTwo, setTimeRangeTwo] = useState<TimeRange | undefined>({ start: "14:00", end: "16:00" });

    return (
        <Grid container spacing={8}>
            <Grid item xs={6}>
                <FieldContainer label="Time-Range Picker" fullWidth>
                    <TimeRangePicker value={timeRangeOne} onChange={setTimeRangeOne} />
                </FieldContainer>
            </Grid>
            <Grid item xs={6}>
                <FieldContainer label="Required" fullWidth required>
                    <TimeRangePicker value={timeRangeTwo} onChange={setTimeRangeTwo} required />
                </FieldContainer>
            </Grid>
        </Grid>
    );
};

export const FinalForm = () => {
    type Values = {
        timeRangeOne?: TimeRange;
        timeRangeThree?: TimeRange;
    };

    return (
        <Form<Values> initialValues={{ timeRangeThree: { start: "14:00", end: "16:00" } }} onSubmit={() => {}}>
            {() => (
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <Field name="timeRangeOne" label="Time-Range Picker" fullWidth component={FinalFormTimeRangePicker} />
                    </Grid>
                    <Grid item xs={6}>
                        <Field name="timeRangeTwo" label="Required" fullWidth component={FinalFormTimeRangePicker} required />
                    </Grid>
                </Grid>
            )}
        </Form>
    );
};
