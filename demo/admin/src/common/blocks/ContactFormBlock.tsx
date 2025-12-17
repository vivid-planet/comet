import { BlockCategory, type BlockInterface, createBlockSkeleton } from "@comet/cms-admin";
import { type ContactFormBlockData, type ContactFormBlockInput } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

export const ContactFormBlock: BlockInterface<ContactFormBlockData, Record<string, never>, ContactFormBlockInput> = {
    ...createBlockSkeleton(),
    name: "ContactForm",
    displayName: <FormattedMessage id="blocks.contactForm" defaultMessage="Contact Form" />,
    defaultValues: () => ({}),
    category: BlockCategory.Form,
};
