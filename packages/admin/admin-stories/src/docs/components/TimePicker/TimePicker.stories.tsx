import { FieldContainer } from "@comet/admin";
import { TimePicker } from "@comet/admin-date-time";
import { Time } from "@comet/admin-icons";
import { Grid, InputAdornment } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Time Picker/Time Picker", module).add("Time Picker", () => {
    const [timeOne, setTimeOne] = React.useState<string | undefined>();
    const [timeTwo, setTimeTwo] = React.useState<string | undefined>();
    const [timeThree, setTimeThree] = React.useState<string | undefined>();
    const [timeFour, setTimeFour] = React.useState<string | undefined>("14:30");

    return (
        <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
                <FieldContainer label="Time Picker" fullWidth>
                    <TimePicker fullWidth value={timeOne} onChange={setTimeOne} />
                </FieldContainer>
            </Grid>
            <Grid item xs={6} md={3}>
                <FieldContainer label="5 Minute step" fullWidth>
                    <TimePicker fullWidth value={timeTwo} onChange={setTimeTwo} minuteStep={5} />
                </FieldContainer>
            </Grid>
            <Grid item xs={6} md={3}>
                <FieldContainer label="10:00 to 14:00 Selectable" fullWidth>
                    <TimePicker fullWidth value={timeThree} onChange={setTimeThree} min="10:00" max="14:00" />
                </FieldContainer>
            </Grid>
            <Grid item xs={6} md={3}>
                <FieldContainer label="With icon & clearable" fullWidth>
                    <TimePicker
                        fullWidth
                        clearable
                        startAdornment={
                            <InputAdornment position="start">
                                <Time />
                            </InputAdornment>
                        }
                        value={timeFour}
                        onChange={setTimeFour}
                    />
                </FieldContainer>
            </Grid>
        </Grid>
    );
});
