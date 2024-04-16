import { Field, FieldContainer } from "@comet/admin";
import { DatePicker, FinalFormDatePicker } from "@comet/admin-date-time";
import { Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/form/components/Date & Time Pickers/Date Picker", module)
    .add("Basic", () => {
        const [dateOne, setDateOne] = React.useState<string | undefined>();
        const [dateTwo, setDateTwo] = React.useState<string | undefined>();
        const [dateThree, setDateThree] = React.useState<string | undefined>("2024-03-10");
        const [dateFour, setDateFour] = React.useState<string | undefined>("2024-03-10");

        return (
            <Grid container spacing={4}>
                <Grid item xs={6} md={3}>
                    <FieldContainer label="Date Picker" fullWidth>
                        <DatePicker fullWidth value={dateOne} onChange={setDateOne} />
                    </FieldContainer>
                </Grid>
                <Grid item xs={6} md={3}>
                    <FieldContainer label="Show two months" fullWidth>
                        <DatePicker fullWidth value={dateTwo} onChange={setDateTwo} monthsToShow={2} />
                    </FieldContainer>
                </Grid>
                <Grid item xs={6} md={3}>
                    <FieldContainer label="Clearable" fullWidth>
                        <DatePicker fullWidth value={dateThree} onChange={setDateThree} />
                    </FieldContainer>
                </Grid>
                <Grid item xs={6} md={3}>
                    <FieldContainer label="Formatted date" fullWidth>
                        <DatePicker
                            fullWidth
                            value={dateFour}
                            onChange={setDateFour}
                            formatDateOptions={{ month: "long", day: "numeric", year: "numeric" }}
                        />
                    </FieldContainer>
                </Grid>
            </Grid>
        );
    })
    .add("Final Form", () => {
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
                        <Grid item xs={6} md={3}>
                            <Field name="dateOne" label="Date Picker" fullWidth component={FinalFormDatePicker} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Field name="dateTwo" label="Show two months" fullWidth component={FinalFormDatePicker} monthsToShow={2} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Field name="dateThree" label="Clearable " fullWidth component={FinalFormDatePicker} clearable />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Field
                                name="dateFour"
                                label="Formatted date"
                                fullWidth
                                component={FinalFormDatePicker}
                                formatDateOptions={{ month: "long", day: "numeric", year: "numeric" }}
                            />
                        </Grid>
                    </Grid>
                )}
            </Form>
        );
    });
