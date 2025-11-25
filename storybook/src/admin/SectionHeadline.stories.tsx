import { SectionHeadline } from "@comet/admin";
import { Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

export default {
    title: "@comet/admin/SectionHeadline",
};

export const Default = () => {
    return (
        <Stack spacing={15}>
            <SectionHeadline supportText="Support Text" divider infoTooltipText="Tooltip Info Text">
                Section Title
            </SectionHeadline>

            <SectionHeadline>Section Title</SectionHeadline>
        </Stack>
    );
};

export const InfoTooltipExamples = () => {
    return (
        <Stack spacing={4}>
            <SectionHeadline infoTooltipText="Hello">
                Using <strong>deprecated</strong> infoTooltipText prop
            </SectionHeadline>
            <SectionHeadline infoTooltip="Hello">Using infoTooltip prop, using string directly</SectionHeadline>
            <SectionHeadline infoTooltip={<FormattedMessage id="stories.formSectionl.infoTooltipExamples.hello" defaultMessage="Hello" />}>
                Using infoTooltip prop, using FormattedMessage directly
            </SectionHeadline>
            <SectionHeadline
                infoTooltip={{
                    title: "Hello",
                }}
            >
                Using infoTooltip prop, using object for title only
            </SectionHeadline>
            <SectionHeadline
                infoTooltip={{
                    title: "Hello",
                    description: "Lorem ipsum",
                    variant: "light",
                }}
            >
                Using infoTooltip prop, using object for title, description and variant
            </SectionHeadline>
            <SectionHeadline
                infoTooltip={{
                    customContent: (
                        <>
                            <Typography variant="subtitle1">Hello</Typography>
                            <Typography variant="body1">Lorem ipsum</Typography>
                        </>
                    ),
                }}
            >
                Using infoTooltip prop, using object for custom content
            </SectionHeadline>
        </Stack>
    );
};
