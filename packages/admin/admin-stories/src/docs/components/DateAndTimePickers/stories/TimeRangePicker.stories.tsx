import { Field, FieldContainer } from "@comet/admin";
import { FinalFormTimeRangePicker, TimeRange, TimeRangePicker } from "@comet/admin-date-time";
import { Time } from "@comet/admin-icons";
import { Grid, InputAdornment } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Date & Time Pickers/Time-Range Picker", module)
    .add("Basic", () => {
        const [timeRangeOne, setTimeRangeOne] = React.useState<TimeRange | undefined>();
        const [timeRangeTwo, setTimeRangeTwo] = React.useState<TimeRange | undefined>({ start: "14:00", end: "16:00" });

        return (
            <Grid container spacing={8}>
                <Grid item xs={6}>
                    <FieldContainer label="Time-Range Picker" fullWidth>
                        <TimeRangePicker value={timeRangeOne} onChange={setTimeRangeOne} />
                    </FieldContainer>
                </Grid>
                <Grid item xs={6}>
                    <FieldContainer label="Clearable with icon" fullWidth>
                        <TimeRangePicker
                            value={timeRangeTwo}
                            onChange={setTimeRangeTwo}
                            clearable
                            componentsProps={{
                                startPicker: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Time />
                                        </InputAdornment>
                                    ),
                                },
                                endPicker: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Time />
                                        </InputAdornment>
                                    ),
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
            timeRangeOne?: TimeRange;
            timeRangeThree?: TimeRange;
        };

        return (
            <Form<Values> initialValues={{ timeRangeThree: { start: "14:00", end: "16:00" } }} onSubmit={() => {}}>
                {() => (
                    <Grid container spacing={8}>
                        <Grid item xs={6}>
                            <Field name="timeRangeOne" label="Time-Range Picker" fullWidth component={FinalFormTimeRangePicker} />
                        </Grid>
                        <Grid item xs={6}>
                            <Field
                                name="timeRangeThree"
                                label="Clearable with icon"
                                fullWidth
                                component={FinalFormTimeRangePicker}
                                clearable
                                componentsProps={{
                                    startPicker: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Time />
                                            </InputAdornment>
                                        ),
                                    },
                                    endPicker: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Time />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                )}
            </Form>
        );
    });
