import { DatePicker, DatePickerField, FieldContainer } from "@comet/admin";
import { Grid } from "@mui/material";
import { useState } from "react";
import { Form } from "react-final-form";

export default {
    title: "Docs/Form/Components/Date & Time Pickers/Date Picker",
};

export const Basic = () => {
    const [dateOne, setDateOne] = useState<string | undefined>();
    const [dateTwo, setDateTwo] = useState<string | undefined>();
    const [dateThree, setDateThree] = useState<string | undefined>("2024-03-10");
    const [dateFour, setDateFour] = useState<string | undefined>("2024-03-10");

    return (
        <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 3 }}>
                <FieldContainer label="Date Picker" fullWidth>
                    <DatePicker fullWidth value={dateOne} onChange={setDateOne} />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <FieldContainer label="With date restriction" fullWidth>
                    <DatePicker fullWidth value={dateTwo} onChange={setDateTwo} minDate={new Date(2024, 0, 1)} maxDate={new Date(2024, 11, 31)} />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <FieldContainer label="Required" fullWidth required>
                    <DatePicker fullWidth value={dateThree} onChange={setDateThree} required />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <FieldContainer label="Read-only" fullWidth>
                    <DatePicker fullWidth value={dateFour} onChange={setDateFour} readOnly />
                </FieldContainer>
            </Grid>
        </Grid>
    );
};

export const FinalForm = () => {
    type Values = {
        dateOne: string;
        dateTwo: string;
        dateThree: string;
        dateFour: string;
    };

    return (
        <Form<Values> initialValues={{ dateThree: "2024-03-10", dateFour: "2024-03-10" }} onSubmit={() => {}}>
            {() => (
                <Grid container spacing={4}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <DatePickerField name="dateOne" label="Date Picker" fullWidth />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <DatePickerField
                            name="dateTwo"
                            label="With date restriction"
                            fullWidth
                            minDate={new Date(2024, 0, 1)}
                            maxDate={new Date(2024, 11, 31)}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <DatePickerField name="dateThree" label="Required" fullWidth required />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <DatePickerField name="dateFour" label="Read-only" fullWidth readOnly />
                    </Grid>
                </Grid>
            )}
        </Form>
    );
};
