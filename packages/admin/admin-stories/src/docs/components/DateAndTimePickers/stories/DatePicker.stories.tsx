import { Field, FieldContainer } from "@comet/admin";
import { DatePicker, FinalFormDatePicker } from "@comet/admin-date-time";
import { Calendar } from "@comet/admin-icons";
import { Grid, InputAdornment } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Date & Time Pickers/Date Picker", module)
    .add("Basic", () => {
        const [dateOne, setDateOne] = React.useState<Date | undefined>();
        const [dateTwo, setDateTwo] = React.useState<Date | undefined>();
        const [dateThree, setDateThree] = React.useState<Date | undefined>(new Date());
        const [dateFour, setDateFour] = React.useState<Date | undefined>(new Date());

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
                    <FieldContainer label="Clearable with icon" fullWidth>
                        <DatePicker
                            fullWidth
                            value={dateThree}
                            onChange={setDateThree}
                            clearable
                            startAdornment={
                                <InputAdornment position="start">
                                    <Calendar />
                                </InputAdornment>
                            }
                        />
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
            dateOne?: Date;
            dateTwo?: Date;
            dateThree?: Date;
            dateFour?: Date;
        };

        return (
            <Form<Values> initialValues={{ dateThree: new Date(), dateFour: new Date() }} onSubmit={() => {}}>
                {() => (
                    <Grid container spacing={4}>
                        <Grid item xs={6} md={3}>
                            <Field name="dateOne" label="Date Picker" fullWidth component={FinalFormDatePicker} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Field name="dateTwo" label="Show two months" fullWidth component={FinalFormDatePicker} monthsToShow={2} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Field
                                name="dateThree"
                                label="Clearable with icon"
                                fullWidth
                                component={FinalFormDatePicker}
                                clearable
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Calendar />
                                    </InputAdornment>
                                }
                            />
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
