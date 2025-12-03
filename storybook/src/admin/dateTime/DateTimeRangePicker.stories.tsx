import { type DateTimeRange, DateTimeRangePicker, DateTimeRangePickerField, FieldContainer } from "@comet/admin";
import { Grid } from "@mui/material";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";
import { useState } from "react";
import { Form } from "react-final-form";

type Story = StoryObj<typeof DateTimeRangePicker>;

const config: Meta<typeof DateTimeRangePicker> = {
    component: DateTimeRangePicker,
    title: "@comet/admin/dateTime/DateTimeRangePicker",
};
export default config;

export const Default: Story = {
    render: () => {
        const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange | undefined>({
            start: new Date("2025-07-23 11:30:00"),
            end: new Date("2025-07-25 14:30:00"),
        });
        const [requiredDateTimeRange, setRequiredDateTimeRange] = useState<DateTimeRange | undefined>(undefined);
        const [disabledDateTimeRange, setDisabledDateTimeRange] = useState<DateTimeRange | undefined>(undefined);
        const [readOnlyDateTimeRange, setReadOnlyDateTimeRange] = useState<DateTimeRange | undefined>({
            start: new Date("2025-07-23 11:30:00"),
            end: new Date("2025-07-25 14:30:00"),
        });

        return (
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FieldContainer label="Date Time Range Picker" fullWidth>
                        <DateTimeRangePicker value={dateTimeRange} onChange={setDateTimeRange} fullWidth />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FieldContainer label="Required Date Time Range Picker" fullWidth required>
                        <DateTimeRangePicker value={requiredDateTimeRange} onChange={setRequiredDateTimeRange} fullWidth required />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FieldContainer label="Disabled Date Time Range Picker" fullWidth disabled>
                        <DateTimeRangePicker value={disabledDateTimeRange} onChange={setDisabledDateTimeRange} fullWidth disabled />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FieldContainer label="ReadOnly Date Time Range Picker" fullWidth>
                        <DateTimeRangePicker value={readOnlyDateTimeRange} onChange={setReadOnlyDateTimeRange} fullWidth readOnly />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <pre>{`values: ${JSON.stringify({ dateTimeRange, requiredDateTimeRange, disabledDateTimeRange, readOnlyDateTimeRange }, null, 2)}`}</pre>
                </Grid>
            </Grid>
        );
    },
};

export const FinalForm: Story = {
    render: () => {
        type Values = {
            dateTimeRange: DateTimeRange;
            requiredDateTimeRange: DateTimeRange;
            disabledDateTimeRange: DateTimeRange;
            readOnlyDateTimeRange: DateTimeRange;
        };

        return (
            <Form<Values>
                initialValues={{
                    dateTimeRange: { start: new Date("2025-07-23 11:30:00"), end: new Date("2025-07-25 14:30:00") },
                    readOnlyDateTimeRange: { start: new Date("2025-07-23 11:30:00"), end: new Date("2025-07-25 14:30:00") },
                }}
                onSubmit={() => {}}
            >
                {({ values }) => (
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <DateTimeRangePickerField name="dateTimeRange" label="Date Time Range Picker" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <DateTimeRangePickerField name="requiredDateTimeRange" label="Required Date Time Range Picker" fullWidth required />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <DateTimeRangePickerField name="disabledDateTimeRange" fullWidth disabled />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <DateTimeRangePickerField name="readOnlyDateTimeRange" label="ReadOnly Date Time Range Picker" fullWidth readOnly />
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
