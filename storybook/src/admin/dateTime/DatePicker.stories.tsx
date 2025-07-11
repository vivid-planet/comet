import { DatePicker, DatePickerField, FieldContainer } from "@comet/admin";
import { Grid } from "@mui/material";
import { type Meta, type StoryObj } from "@storybook/react-webpack5";
import { useState } from "react";
import { Form } from "react-final-form";

type Story = StoryObj<typeof DatePicker>;

const config: Meta<typeof DatePicker> = {
    component: DatePicker,
    title: "@comet/admin/dateTime/DatePicker",
};
export default config;

export const Default: Story = {
    render: () => {
        const [dateOne, setDateOne] = useState<string | undefined>("2025-07-23");
        const [dateTwo, setDateTwo] = useState<string | undefined>(undefined);
        const [dateThree, setDateThree] = useState<string | undefined>(undefined);
        const [dateFour, setDateFour] = useState<string | undefined>("2025-07-23");

        return (
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FieldContainer label="Date Picker" fullWidth>
                        <DatePicker value={dateOne} onChange={setDateOne} fullWidth />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FieldContainer label="Required Date Picker" fullWidth required>
                        <DatePicker value={dateTwo} onChange={setDateTwo} fullWidth required />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FieldContainer label="Disabled Date Picker" fullWidth disabled>
                        <DatePicker value={dateThree} onChange={setDateThree} fullWidth disabled />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FieldContainer label="Readonly Date Picker" fullWidth>
                        <DatePicker value={dateFour} onChange={setDateFour} fullWidth readOnly />
                    </FieldContainer>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <pre>{`values: ${JSON.stringify({ dateOne, dateTwo, dateThree, dateFour }, null, 2)}`}</pre>
                </Grid>
            </Grid>
        );
    },
};

export const FinalForm: Story = {
    render: () => {
        type Values = {
            dateOne: string;
            dateTwo: string;
            dateThree: string;
            dateFour: string;
        };

        return (
            <Form<Values>
                initialValues={{
                    dateOne: "2025-07-23",
                    dateFour: "2025-07-23",
                }}
                onSubmit={() => {}}
            >
                {({ values }) => (
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <DatePickerField name="dateOne" label="Date Picker" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <DatePickerField name="dateTwo" label="Required Date Picker" fullWidth required />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <DatePickerField name="dateThree" label="Disabled Date Picker" fullWidth disabled />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <DatePickerField name="dateFour" label="Readonly Date Picker" fullWidth readOnly />
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
