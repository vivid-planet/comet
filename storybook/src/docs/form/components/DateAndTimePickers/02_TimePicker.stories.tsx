import { FieldContainer, TimePicker, TimePickerField } from "@comet/admin";
import { Grid } from "@mui/material";
import { useState } from "react";
import { Form } from "react-final-form";

export default {
    title: "Docs/Form/Components/Date & Time Pickers/Time Picker",
};

export const Basic = () => {
    const [timeOne, setTimeOne] = useState<string | undefined>();
    const [timeTwo, setTimeTwo] = useState<string | undefined>();
    const [timeThree, setTimeThree] = useState<string | undefined>();
    const [timeFour, setTimeFour] = useState<string | undefined>("14:30");

    return (
        <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 3 }}>
                <FieldContainer label="Time Picker" fullWidth>
                    <TimePicker fullWidth value={timeOne} onChange={setTimeOne} />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <FieldContainer label="5 Minute step" fullWidth>
                    <TimePicker fullWidth value={timeTwo} onChange={setTimeTwo} minutesStep={5} />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <FieldContainer label="10:00 to 14:00 Selectable" fullWidth>
                    <TimePicker
                        fullWidth
                        value={timeThree}
                        onChange={setTimeThree}
                        minTime={new Date(2024, 0, 1, 10, 0)}
                        maxTime={new Date(2024, 0, 1, 14, 0)}
                    />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <FieldContainer label="Required" fullWidth required>
                    <TimePicker fullWidth required value={timeFour} onChange={setTimeFour} />
                </FieldContainer>
            </Grid>
        </Grid>
    );
};

export const FinalForm = () => {
    type Values = {
        timeOne?: string;
        timeTwo?: string;
        timeThree?: string;
        timeFour?: string;
    };

    return (
        <Form<Values> initialValues={{ timeFour: "14:30" }} onSubmit={() => {}}>
            {() => (
                <Grid container spacing={4}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <TimePickerField name="timeOne" label="Time Picker" fullWidth />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <TimePickerField name="timeTwo" label="5 Minute step" fullWidth minutesStep={5} />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <TimePickerField
                            name="timeThree"
                            label="10:00 to 14:00 Selectable"
                            fullWidth
                            minTime={new Date(2024, 0, 1, 10, 0)}
                            maxTime={new Date(2024, 0, 1, 14, 0)}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <TimePickerField name="timeFour" label="Required" fullWidth required />
                    </Grid>
                </Grid>
            )}
        </Form>
    );
};
