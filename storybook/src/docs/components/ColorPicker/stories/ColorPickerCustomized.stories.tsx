import { FieldContainer } from "@comet/admin";
import { ColorPicker, ColorPickerColorPreviewProps } from "@comet/admin-color-picker";
import { EmojiEmotions, MoodBad, SentimentDissatisfied } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Color Picker/Color Picker Customized", module).add("Color Picker Customized", () => {
    const [colorOne, setColorOne] = React.useState<string | undefined>("#00ff00");
    const [colorTwo, setColorTwo] = React.useState<string | undefined>("rgba(255, 127, 80, 0.75)");
    const [colorThree, setColorThree] = React.useState<string | undefined>();

    const CustomColorPreview = ({ color }: ColorPickerColorPreviewProps): React.ReactElement => {
        return <EmojiEmotions htmlColor={color} sx={{ fontSize: 24 }} />;
    };

    const CustomColorEmptyPreview = (): React.ReactElement => {
        return <SentimentDissatisfied color="warning" sx={{ fontSize: 24 }} />;
    };

    const CustomColorInvalidPreview = (): React.ReactElement => {
        return <MoodBad color="error" sx={{ fontSize: 24 }} />;
    };

    return (
        <Grid container spacing={4} sx={{ pb: 2 }}>
            <Grid item md={4}>
                <FieldContainer label="Without Picker" fullWidth>
                    <ColorPicker
                        fullWidth
                        value={colorOne}
                        onChange={setColorOne}
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
                        hidePicker
                    />
                </FieldContainer>
            </Grid>
            <Grid item md={4}>
                <FieldContainer label="Clearable" fullWidth>
                    <ColorPicker fullWidth clearable value={colorTwo} onChange={setColorTwo} colorFormat="rgba" />
                </FieldContainer>
            </Grid>
            <Grid item md={4}>
                <FieldContainer label="Custom Color Preview" fullWidth>
                    <ColorPicker
                        fullWidth
                        value={colorThree}
                        onChange={setColorThree}
                        components={{
                            ColorPickerColorPreview: CustomColorPreview,
                            ColorPickerInvalidPreview: CustomColorInvalidPreview,
                            ColorPickerEmptyPreview: CustomColorEmptyPreview,
                        }}
                    />
                </FieldContainer>
            </Grid>
        </Grid>
    );
});
