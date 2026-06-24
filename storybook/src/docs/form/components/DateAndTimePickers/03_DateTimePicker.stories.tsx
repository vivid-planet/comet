import { DateTimePicker, DateTimePickerField, FieldContainer } from "@comet/admin";
import { Grid } from "@mui/material";
import { useState } from "react";
import { Form } from "react-final-form";

export default {
    title: "Docs/Form/Components/Date & Time Pickers/Date-Time Picker",
};

export const Basic = () => {
    const [dateTimeOne, setDateTimeOne] = useState<Date | undefined>();
    const [dateTimeTwo, setDateTimeTwo] = useState<Date | undefined>(new Date());
    const [dateTimeThree, setDateTimeThree] = useState<Date | undefined>();
    const [dateTimeFour, setDateFour] = useState<Date | undefined>(new Date());

    return (
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
                <FieldContainer label="Date-Time Picker" fullWidth>
                    <DateTimePicker fullWidth value={dateTimeOne} onChange={setDateTimeOne} />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <FieldContainer label="Required" fullWidth required>
                    <DateTimePicker fullWidth value={dateTimeTwo} onChange={setDateTimeTwo} required />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <FieldContainer label="With date restriction" fullWidth>
                    <DateTimePicker
                        fullWidth
                        value={dateTimeThree}
                        onChange={setDateTimeThree}
                        minDateTime={new Date(2024, 0, 1)}
                        maxDateTime={new Date(2024, 11, 31)}
                    />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <FieldContainer label="Read-only" fullWidth>
                    <DateTimePicker fullWidth value={dateTimeFour} onChange={setDateFour} readOnly />
                </FieldContainer>
            </Grid>
        </Grid>
    );
};

export const FinalForm = () => {
    type Values = {
        dateTimeOne?: Date;
        dateTimeTwo?: Date;
        dateTimeThree?: Date;
        dateTimeFour?: Date;
    };

    return (
        <Form<Values> initialValues={{ dateTimeTwo: new Date(), dateTimeFour: new Date() }} onSubmit={() => {}}>
            {() => (
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DateTimePickerField name="dateTimeOne" label="Date-Time Picker" fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DateTimePickerField name="dateTimeTwo" label="Required" fullWidth required />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DateTimePickerField
                            name="dateTimeThree"
                            label="With date restriction"
                            fullWidth
                            minDateTime={new Date(2024, 0, 1)}
                            maxDateTime={new Date(2024, 11, 31)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DateTimePickerField name="dateTimeFour" label="Read-only" fullWidth readOnly />
                    </Grid>
                </Grid>
            )}
        </Form>
    );
};
