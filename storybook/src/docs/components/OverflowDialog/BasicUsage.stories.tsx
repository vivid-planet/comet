import { OverflowDialog } from "@comet/admin";
import { Box, Link, Paper, Typography, TypographyProps } from "@mui/material";
import {} from "@mui/system";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/OverflowDialog", module).add("Basic usage", () => {
    const DummyParagraph = (p: TypographyProps) => (
        <Typography variant="body2" {...p}>
            Curabitur blandit tempus porttitor. Nullam id dolor{" "}
            <Link href="#" target="_blank">
                this is a link
            </Link>{" "}
            id nibh ultricies vehicula ut id elit. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor
            mauris condimentum nibh, ut fermentum massa justo sit amet risus.
        </Typography>
    );

    const DummyImage = () => (
        <Box
            sx={({ palette }) => ({
                aspectRatio: "21 / 9",
                backgroundColor: palette.grey[100],
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 4,
            })}
        >
            <Typography variant="h2">This could be an image.</Typography>
        </Box>
    );

    return (
        <Paper elevation={1} sx={{ p: 2, height: 110 }}>
            <OverflowDialog>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Ornare Inceptos Egestas Bibendum
                </Typography>
                <DummyParagraph gutterBottom />
                <DummyImage />
                <DummyParagraph gutterBottom />
                <DummyParagraph gutterBottom />
                <DummyImage />
                <DummyParagraph gutterBottom />
                <DummyParagraph />
            </OverflowDialog>
        </Paper>
    );
});
