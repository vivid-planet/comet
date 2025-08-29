import { SectionHeadline } from "@comet/admin";
import { Stack } from "@mui/material";

export default {
    title: "@comet/admin/SectionHeadline",
};

export const _SectionHeadline = () => {
    return (
        <Stack spacing={15}>
            <SectionHeadline supportText="Support Text" divider infoTooltip="Tooltip Info Text">
                Section Title
            </SectionHeadline>

            <SectionHeadline>Section Title</SectionHeadline>
        </Stack>
    );
};
