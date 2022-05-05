import { FieldContainer } from "@comet/admin";
import { ColorPicker } from "@comet/admin-color-picker";
import { Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Color Picker/Color Picker", module).add("Color Picker", () => {
    const [colorOne, setColorOne] = React.useState<string | null>("#00ff00");
    const [colorTwo, setColorTwo] = React.useState<string | null>("rgba(255, 127, 80, 0.75)");
    const [colorThree, setColorThree] = React.useState<string | null>(null);
    const [colorFour, setColorFour] = React.useState<string | null>(null);

    return (
        <Grid container spacing={4}>
            <Grid item md={3}>
                <FieldContainer label="Color Picker" fullWidth>
                    <ColorPicker fullWidth value={colorOne} onChange={setColorOne} />
                </FieldContainer>
            </Grid>
            <Grid item md={3}>
                <FieldContainer label="With Alpha Slider" fullWidth>
                    <ColorPicker fullWidth value={colorTwo} onChange={setColorTwo} colorFormat="rgba" />
                </FieldContainer>
            </Grid>
            <Grid item md={3}>
                <FieldContainer label="With Color Palette" fullWidth>
                    <ColorPicker
                        fullWidth
                        value={colorThree}
                        onChange={setColorThree}
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
                </FieldContainer>
            </Grid>
            <Grid item md={3}>
                <FieldContainer label="Disabled" fullWidth disabled>
                    <ColorPicker fullWidth disabled value={colorFour} onChange={setColorFour} />
                </FieldContainer>
            </Grid>
        </Grid>
    );
});
