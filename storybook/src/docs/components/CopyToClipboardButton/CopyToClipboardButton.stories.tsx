import { CopyToClipboardButton } from "@comet/admin";
import { Card, CardContent, Grid, Typography, useTheme } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/CopyToClipboardButton",
};

export const _CopyToClipboardButton = {
    render: () => {
        const {
            typography: { fontWeightMedium },
        } = useTheme();

        const copyTexts = [
            "Lorem ipsum sit dolor",
            "Aenean Vestibulum Adipiscing",
            "Nullam Porta Venenatis Pharetra",
            "Quam Dapibus Venenatis Vulputate",
        ];

        return (
            <Grid container spacing={4}>
                {copyTexts.map((text, index) => (
                    <Grid key={index} item xs={12} md={6}>
                        <Card>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography>Copy to the clipboard:</Typography>
                                <Typography fontWeight={fontWeightMedium} sx={{ marginBottom: 4 }}>
                                    “{text}”
                                </Typography>
                                <CopyToClipboardButton copyText={text} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    },

    name: "CopyToClipboardButton",
};
