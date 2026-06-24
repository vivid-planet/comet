import { type DateRange, DateRangePicker, DateRangePickerField, FieldContainer } from "@comet/admin";
import { Grid } from "@mui/material";
import { useState } from "react";
import { Form } from "react-final-form";

export default {
    title: "Docs/Form/Components/Date & Time Pickers/Date-Range Picker",
};

export const Basic = () => {
    const [dateOne, setDateOne] = useState<DateRange | undefined>();
    const [dateTwo, setDateTwo] = useState<DateRange | undefined>({ start: "2024-03-10", end: "2024-03-16" });
    const [dateThree, setDateThree] = useState<DateRange | undefined>({ start: "2024-03-10", end: "2024-03-16" });

    return (
        <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 4 }}>
                <FieldContainer label="Date-Range Picker" fullWidth>
                    <DateRangePicker fullWidth value={dateOne} onChange={setDateOne} />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
                <FieldContainer label="Required" fullWidth required>
                    <DateRangePicker fullWidth value={dateTwo} onChange={setDateTwo} required />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
                <FieldContainer label="With date restriction" fullWidth>
                    <DateRangePicker
                        fullWidth
                        value={dateThree}
                        onChange={setDateThree}
                        minDate={new Date(2024, 0, 1)}
                        maxDate={new Date(2024, 11, 31)}
                    />
                </FieldContainer>
            </Grid>
        </Grid>
    );
};

export const FinalForm = () => {
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
                    <Grid size={{ xs: 6, md: 4 }}>
                        <DateRangePickerField name="dateOne" label="Date-Range Picker" fullWidth />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                        <DateRangePickerField name="dateTwo" label="Required" fullWidth required />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                        <DateRangePickerField
                            name="dateThree"
                            label="With date restriction"
                            fullWidth
                            minDate={new Date(2024, 0, 1)}
                            maxDate={new Date(2024, 11, 31)}
                        />
                    </Grid>
                </Grid>
            )}
        </Form>
    );
};
