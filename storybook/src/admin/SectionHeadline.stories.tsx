import { SectionHeadline } from "@comet/admin";
import { Stack, Typography } from "@mui/material";

export default {
    title: "@comet/admin/SectionHeadline",
};

export const _SectionHeadline = () => {
    return (
        <Stack spacing={15}>
            <SectionHeadline supportText="Support Text" divider infoTooltip="Tooltip Info Text">
                <Typography variant="h4">Section Title</Typography>
            </SectionHeadline>

            <SectionHeadline>
                <Typography variant="h4">Section Title</Typography>
            </SectionHeadline>
        </Stack>
    );
};
