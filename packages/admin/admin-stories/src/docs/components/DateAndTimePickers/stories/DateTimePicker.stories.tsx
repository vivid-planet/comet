import { Field, FieldContainer } from "@comet/admin";
import { DateTimePicker, FinalFormDateTimePicker } from "@comet/admin-date-time";
import { Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Date & Time Pickers/Date-Time Picker", module)
    .add("Basic", () => {
        const [dateTimeOne, setDateTimeOne] = React.useState<Date | undefined>();
        const [dateTimeTwo, setDateTimeTwo] = React.useState<Date | undefined>(new Date());
        const [dateTimeThree, setDateTimeThree] = React.useState<Date | undefined>();
        const [dateTimeFour, setDateFour] = React.useState<Date | undefined>(new Date());

        return (
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <FieldContainer label="Date-Time Picker" fullWidth>
                        <DateTimePicker value={dateTimeOne} onChange={setDateTimeOne} />
                    </FieldContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FieldContainer label="Clearable" fullWidth>
                        <DateTimePicker value={dateTimeTwo} onChange={setDateTimeTwo} clearable />
                    </FieldContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FieldContainer label="Custom placeholders" fullWidth>
                        <DateTimePicker
                            value={dateTimeThree}
                            onChange={setDateTimeThree}
                            componentsProps={{
                                datePicker: { placeholder: "Date placeholder" },
                                timePicker: { placeholder: "Time Placeholder" },
                            }}
                        />
                    </FieldContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FieldContainer label="Custom date format" fullWidth>
                        <DateTimePicker
                            value={dateTimeFour}
                            onChange={setDateFour}
                            componentsProps={{
                                datePicker: {
                                    formatDateOptions: {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    },
                                },
                            }}
                        />
                    </FieldContainer>
                </Grid>
            </Grid>
        );
    })
    .add("Final Form", () => {
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
                        <Grid item xs={12} md={6}>
                            <Field name="dateTimeOne" label="Date Picker" fullWidth component={FinalFormDateTimePicker} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Field name="dateTimeTwo" label="Clearable" fullWidth component={FinalFormDateTimePicker} clearable />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Field
                                name="dateTimeThree"
                                label="Custom placeholders"
                                fullWidth
                                component={FinalFormDateTimePicker}
                                componentsProps={{
                                    datePicker: { placeholder: "Date placeholder" },
                                    timePicker: { placeholder: "Time Placeholder" },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Field
                                name="dateTimeFour"
                                label="Custom date format"
                                fullWidth
                                component={FinalFormDateTimePicker}
                                componentsProps={{
                                    datePicker: {
                                        formatDateOptions: {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        },
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                )}
            </Form>
        );
    });
