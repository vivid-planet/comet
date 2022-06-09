import { Field } from "@comet/admin";
import { FinalFormTimePicker } from "@comet/admin-date-time";
import { Time } from "@comet/admin-icons";
import { Grid, InputAdornment } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Time Picker/Time Picker Final Form", module).add("Time Picker Final Form", () => {
    return (
        <Form initialValues={{ timeFour: "14:30" }} onSubmit={() => {}}>
            {() => (
                <Grid container spacing={4}>
                    <Grid item xs={6} md={3}>
                        <Field name="timeOne" label="Time Picker" fullWidth component={FinalFormTimePicker} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Field name="timeTwo" label="5 Minute step" fullWidth component={FinalFormTimePicker} minuteStep={5} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Field name="timeThree" label="10:00 to 14:00 Selectable" fullWidth component={FinalFormTimePicker} min="10:00" max="14:00" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Field
                            name="timeFour"
                            label="With icon & clearable"
                            fullWidth
                            component={FinalFormTimePicker}
                            clearable
                            startAdornment={
                                <InputAdornment position="start">
                                    <Time />
                                </InputAdornment>
                            }
                        />
                    </Grid>
                </Grid>
            )}
        </Form>
    );
});
