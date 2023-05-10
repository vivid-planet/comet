import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Accordion", module).add("BasicAccordion", () => {
    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon />}>
                <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5" sx={{ textTransform: "uppercase", fontWeight: "medium" }}>
                            This is a basic accordion
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Support Text
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2">End Adornment</Typography>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
});
