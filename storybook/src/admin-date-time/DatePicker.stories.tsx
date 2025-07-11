import { FieldContainer } from "@comet/admin";
import { DateField, DatePicker } from "@comet/admin-date-time";
import { Card, CardContent, Grid, InputBase, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Form } from "react-final-form";

export default {
    title: "@comet/admin-date-time",
};

export const DatePickerStory = () => {
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

    const [textField, setTextField] = useState<string | undefined>();

    return (
        <Grid container spacing={4} padding={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            DatePicker
                        </Typography>

                        <FieldContainer label="Default" fullWidth>
                            <DatePicker fullWidth value={defaultDate} onChange={setDefaultDate} />
                        </FieldContainer>
                        <FieldContainer label="Required" fullWidth required>
                            <DatePicker fullWidth value={requiredDate} onChange={setRequiredDate} required />
                        </FieldContainer>
                        <FieldContainer label="With value" fullWidth>
                            <DatePicker fullWidth value={dateWithInitialValue} onChange={setDateWithInitialValue} />
                        </FieldContainer>
                        <FieldContainer label="Disabled" fullWidth disabled>
                            <DatePicker fullWidth disabled value={disabledDate} onChange={setDisabledDate} />
                        </FieldContainer>
                        <FieldContainer label="Disabled with value" fullWidth disabled>
                            <DatePicker fullWidth disabled value={disabledDateWithInitialValue} onChange={setDisabledDateWithInitialValue} />
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
                                        FinalForm DatePicker
                                    </Typography>
                                    <DateField name="defaultDate" label="Default" fullWidth />
                                    <DateField name="requiredDate" label="Required" fullWidth required />
                                    <DateField name="dateWithInitialValue" label="With value" fullWidth />
                                    <DateField name="disabledDate" label="Disabled" fullWidth disabled />
                                    <DateField name="disabledDateWithInitialValue" label="Disabled with value" fullWidth disabled />
                                </CardContent>
                            </Card>
                            <pre>{JSON.stringify(values, null, 4)}</pre>
                        </form>
                    )}
                </Form>
            </Grid>

            {/* TODO: Remove this and consider fixing in V8 */}
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Make `TextField` work in `FieldContainer`, just like `InputBase`
                        </Typography>
                        <Stack spacing={2} direction="row">
                            <FieldContainer label="TextField" fullWidth>
                                <TextField
                                    placeholder="TextField"
                                    fullWidth
                                    value={textField}
                                    onChange={(e) => setTextField(e.target.value)}
                                    // TODO: What of this can we move to the theme?
                                    variant="standard"
                                    slotProps={{ input: { disableUnderline: true } }}
                                />
                            </FieldContainer>
                            <FieldContainer label="InputBase" fullWidth>
                                <InputBase placeholder="InputBase" fullWidth value={textField} onChange={(e) => setTextField(e.target.value)} />
                            </FieldContainer>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
