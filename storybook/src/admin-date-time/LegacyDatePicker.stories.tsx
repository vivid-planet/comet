import { Field, FieldContainer } from "@comet/admin";
import { FinalFormLegacyDatePicker, LegacyDatePicker } from "@comet/admin-date-time";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { Form } from "react-final-form";

export default {
    title: "@comet/admin-date-time",
};

export const LegacyDatePickerStory = () => {
    type FinalFormValues = {
        defaultDate: string;
        requiredDate: string;
        disabledDate: string;
        dateWithInitialValue: string;
        disabledDateWithInitialValue: string;
    };

    const [defaultDate, setDefaultDate] = useState<string | undefined>();
    const [requiredDate, setRequiredDate] = useState<string | undefined>();
    const [dateWithInitialValue, setDateWithInitialValue] = useState<string | undefined>("2025-04-01");
    const [disabledDate, setDisabledDate] = useState<string | undefined>();
    const [disabledDateWithInitialValue, setDisabledDateWithInitialValue] = useState<string | undefined>("2025-04-01");

    return (
        <Grid container spacing={4} padding={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            LegacyDatePicker
                        </Typography>

                        <FieldContainer label="Default" fullWidth>
                            <LegacyDatePicker fullWidth value={defaultDate} onChange={setDefaultDate} />
                        </FieldContainer>
                        <FieldContainer label="Required" fullWidth required>
                            <LegacyDatePicker fullWidth value={requiredDate} onChange={setRequiredDate} required />
                        </FieldContainer>
                        <FieldContainer label="With value" fullWidth>
                            <LegacyDatePicker fullWidth value={dateWithInitialValue} onChange={setDateWithInitialValue} />
                        </FieldContainer>
                        <FieldContainer label="Disabled" fullWidth disabled>
                            <LegacyDatePicker fullWidth disabled value={disabledDate} onChange={setDisabledDate} />
                        </FieldContainer>
                        <FieldContainer label="Disabled with value" fullWidth disabled>
                            <LegacyDatePicker fullWidth disabled value={disabledDateWithInitialValue} onChange={setDisabledDateWithInitialValue} />
                        </FieldContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Form<FinalFormValues>
                    onSubmit={() => {}}
                    initialValues={{
                        dateWithInitialValue: "2025-04-01",
                        disabledDateWithInitialValue: "2025-04-01",
                    }}
                >
                    {({ values }) => (
                        <form>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" gutterBottom>
                                        FinalForm LegacyDatePicker
                                    </Typography>
                                    <Field name="defaultDate" label="Default" fullWidth component={FinalFormLegacyDatePicker} />
                                    <Field name="requiredDate" label="Required" fullWidth required component={FinalFormLegacyDatePicker} />
                                    <Field name="dateWithInitialValue" label="With value" fullWidth component={FinalFormLegacyDatePicker} />
                                    <Field name="disabledDate" label="Disabled" fullWidth disabled component={FinalFormLegacyDatePicker} />
                                    <Field
                                        name="disabledDateWithInitialValue"
                                        label="Disabled with value"
                                        fullWidth
                                        disabled
                                        component={FinalFormLegacyDatePicker}
                                    />
                                </CardContent>
                            </Card>
                            <pre>{JSON.stringify(values, null, 4)}</pre>
                        </form>
                    )}
                </Form>
            </Grid>
        </Grid>
    );
};
