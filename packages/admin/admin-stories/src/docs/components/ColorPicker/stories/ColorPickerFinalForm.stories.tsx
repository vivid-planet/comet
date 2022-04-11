import { Field } from "@comet/admin";
import { FinalFormColorPicker } from "@comet/admin-color-picker";
import { Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Color Picker/Color Picker Final Form", module).add("Color Picker Final Form", () => {
    return (
        <Form initialValues={{ color1: "#00ff00", color2: "rgba(255, 127, 80, 0.75)" }} onSubmit={() => {}}>
            {({ values }) => {
                return (
                    <Grid container spacing={4}>
                        <Grid item md={3}>
                            <Field name="color1" label="Color-Picker" fullWidth component={FinalFormColorPicker} />
                        </Grid>
                        <Grid item md={3}>
                            <Field name="color2" label="With Alpha Slider" fullWidth component={FinalFormColorPicker} colorFormat="rgba" />
                        </Grid>
                        <Grid item md={3}>
                            <Field
                                name="color3"
                                label="With Color Palette"
                                fullWidth
                                component={FinalFormColorPicker}
                                colorPalette={[
                                    "#f94144",
                                    "#f3722c",
                                    "#f8961e",
                                    "#f9844a",
                                    "#f9c74f",
                                    "#90be6d",
                                    "#43aa8b",
                                    "#4d908e",
                                    "#577590",
                                    "#277da1",
                                    "red",
                                    "blue",
                                    "lime",
                                    "#29B6F6",
                                    "#14CC33",
                                    "#A02710",
                                    "#226600",
                                    "#009FBF",
                                ]}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <Field name="color4" label="Disabled" fullWidth disabled component={FinalFormColorPicker} />
                        </Grid>
                    </Grid>
                );
            }}
        </Form>
    );
});
