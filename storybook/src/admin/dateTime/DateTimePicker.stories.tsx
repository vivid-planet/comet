import { FieldContainer, Future_DateTimePicker as DateTimePicker, Future_DateTimePickerField as DateTimePickerField } from "@comet/admin";
import { Grid } from "@mui/material";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";
import { useState } from "react";
import { Form } from "react-final-form";

type Story = StoryObj<typeof DateTimePicker>;

const config: Meta<typeof DateTimePicker> = {
    component: DateTimePicker,
    title: "@comet/admin/dateTime/DateTimePicker",
};
export default config;

export const Default: Story = {
    render: () => {
        const [dateTime, setDateTime] = useState<string | undefined>("2025-07-23T12:34");
        const [requiredDateTime, setRequiredDateTime] = useState<string | undefined>(undefined);
        const [disabledDateTime, setDisabledDateTime] = useState<string | undefined>(undefined);
        const [readOnlyDateTime, setReadOnlyDateTime] = useState<string | undefined>("2025-07-23T12:34");

        return (
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FieldContainer label="Date-Time Picker" fullWidth>
                        <DateTimePicker value={dateTime} onChange={setDateTime} fullWidth />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FieldContainer label="Required Date-Time Picker" fullWidth required>
                        <DateTimePicker value={requiredDateTime} onChange={setRequiredDateTime} fullWidth required />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FieldContainer label="Disabled Date-Time Picker" fullWidth disabled>
                        <DateTimePicker value={disabledDateTime} onChange={setDisabledDateTime} fullWidth disabled />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FieldContainer label="ReadOnly Date-Time Picker" fullWidth>
                        <DateTimePicker value={readOnlyDateTime} onChange={setReadOnlyDateTime} fullWidth readOnly />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <pre>{`values: ${JSON.stringify({ dateTime, requiredDateTime, disabledDateTime, readOnlyDateTime }, null, 2)}`}</pre>
                </Grid>
            </Grid>
        );
    },
};

export const FinalForm: Story = {
    render: () => {
        type Values = {
            dateTime: string;
            requiredDateTime: string;
            disabledDateTime: string;
            readOnlyDateTime: string;
        };

        return (
            <Form<Values>
                initialValues={{
                    dateTime: "2025-07-23T12:34",
                    readOnlyDateTime: "2025-07-23T12:34",
                }}
                onSubmit={() => {}}
            >
                {({ values }) => (
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <DateTimePickerField name="dateTime" label="Date-Time Picker" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <DateTimePickerField name="requiredDateTime" label="Required Date-Time Picker" fullWidth required />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <DateTimePickerField name="disabledDateTime" label="Disabled Date-Time Picker" fullWidth disabled />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <DateTimePickerField name="readOnlyDateTime" label="ReadOnly Date-Time Picker" fullWidth readOnly />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <pre>{`values: ${JSON.stringify(values, null, 2)}`}</pre>
                        </Grid>
                    </Grid>
                )}
            </Form>
        );
    },
};
