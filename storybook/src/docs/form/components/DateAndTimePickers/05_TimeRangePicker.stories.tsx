import { FieldContainer, type TimeRange, TimeRangePicker, TimeRangePickerField } from "@comet/admin";
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
            <Grid size={6}>
                <FieldContainer label="Time-Range Picker" fullWidth>
                    <TimeRangePicker fullWidth value={timeRangeOne} onChange={setTimeRangeOne} />
                </FieldContainer>
            </Grid>
            <Grid size={6}>
                <FieldContainer label="Required" fullWidth required>
                    <TimeRangePicker fullWidth value={timeRangeTwo} onChange={setTimeRangeTwo} required />
                </FieldContainer>
            </Grid>
        </Grid>
    );
};

export const FinalForm = () => {
    type Values = {
        timeRangeOne?: TimeRange;
        timeRangeTwo?: TimeRange;
    };

    return (
        <Form<Values> initialValues={{ timeRangeTwo: { start: "14:00", end: "16:00" } }} onSubmit={() => {}}>
            {() => (
                <Grid container spacing={8}>
                    <Grid size={6}>
                        <TimeRangePickerField name="timeRangeOne" label="Time-Range Picker" fullWidth />
                    </Grid>
                    <Grid size={6}>
                        <TimeRangePickerField name="timeRangeTwo" label="Required" fullWidth required />
                    </Grid>
                </Grid>
            )}
        </Form>
    );
};
