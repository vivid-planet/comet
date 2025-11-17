import { FormSection } from "@comet/admin";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

export default {
    title: "@comet/admin/FormSection",
};

export const InfoTooltipExamples = {
    render: () => {
        return (
            <>
                <FormSection
                    title="FormSection"
                    slotProps={{
                        title: { infoTooltipText: "Hello" },
                    }}
                >
                    <Typography>
                        Using <strong>deprecated</strong> infoTooltipText prop through slotProps.title
                    </Typography>
                </FormSection>
                <FormSection title="FormSection" infoTooltip="Hello">
                    <Typography>Using infoTooltip prop, using string directly</Typography>
                </FormSection>
                <FormSection
                    title="FormSection"
                    infoTooltip={<FormattedMessage id="stories.formSectionl.infoTooltipExamples.hello" defaultMessage="Hello" />}
                >
                    <Typography>Using infoTooltip prop, using FormattedMessage directly</Typography>
                </FormSection>
                <FormSection
                    title="FormSection"
                    infoTooltip={{
                        title: "Hello",
                    }}
                >
                    <Typography>Using infoTooltip prop, using object for title only</Typography>
                </FormSection>
                <FormSection
                    title="FormSection"
                    infoTooltip={{
                        title: "Hello",
                        description: "Lorem ipsum",
                        variant: "light",
                    }}
                >
                    <Typography>Using infoTooltip prop, using object for title, description and variant</Typography>
                </FormSection>
                <FormSection
                    title="FormSection"
                    infoTooltip={{
                        customContent: (
                            <>
                                <Typography variant="subtitle1">Hello</Typography>
                                <Typography variant="body1">Lorem ipsum</Typography>
                            </>
                        ),
                    }}
                >
                    <Typography>Using infoTooltip prop, using object for custom content</Typography>
                </FormSection>
            </>
        );
    },
};
