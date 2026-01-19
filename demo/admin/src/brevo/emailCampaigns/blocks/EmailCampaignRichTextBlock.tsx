import { CopyToClipboardButton } from "@comet/admin";
import {
    BlockAdminComponentPaper,
    type BlockAdminComponentProps,
    BlockAdminComponentSection,
    createRichTextBlock,
    ExternalLinkBlock,
    type RichTextBlockState,
} from "@comet/cms-admin";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { FormattedMessage } from "react-intl";

const placeholders = [
    {
        placeholder: "{{SALUTATION}}",
        helper: <FormattedMessage id="cometBrevoModule.richText.placeholder.salutation" defaultMessage="Dear Mr./Ms. LASTNAME" />,
    },
];

const BaseRichTextBlock = createRichTextBlock({
    link: ExternalLinkBlock,
    rte: {
        supports: ["bold", "italic", "header-one", "header-two", "header-three", "header-four", "header-five", "header-six", "link", "links-remove"],
    },
});

export const EmailCampaignRichTextBlock = {
    ...BaseRichTextBlock,
    AdminComponent: (rteAdminComponentProps: BlockAdminComponentProps<RichTextBlockState>) => (
        <>
            <BlockAdminComponentSection>
                <BaseRichTextBlock.AdminComponent {...rteAdminComponentProps} />
            </BlockAdminComponentSection>
            <BlockAdminComponentSection
                title={<FormattedMessage id="cometBrevoModule.richText.placeholder.info" defaultMessage="Placeholders available in the text" />}
            >
                <BlockAdminComponentPaper disablePadding>
                    <List>
                        {placeholders.map(({ placeholder, helper }) => {
                            const placeholderText = <Box sx={{ fontFamily: "monospace", fontWeight: "bold" }}>{placeholder}</Box>;
                            return (
                                <ListItem key={placeholder} secondaryAction={<CopyToClipboardButton copyText={placeholder} />}>
                                    <ListItemText primary={placeholderText} secondary={helper} />
                                </ListItem>
                            );
                        })}
                    </List>
                </BlockAdminComponentPaper>
            </BlockAdminComponentSection>
        </>
    ),
};
