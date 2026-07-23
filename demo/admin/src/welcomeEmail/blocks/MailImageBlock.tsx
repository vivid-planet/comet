import { BlockCategory, createCompositeBlock, createCompositeBlockSwitchField, PixelImageBlock } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

export const MailImageBlock = createCompositeBlock({
    name: "MailImage",
    displayName: <FormattedMessage id="welcomeEmail.image.displayName" defaultMessage="Image" />,
    category: BlockCategory.Media,
    blocks: {
        image: {
            block: PixelImageBlock,
            title: <FormattedMessage id="welcomeEmail.image.image" defaultMessage="Image" />,
        },
        fullWidth: {
            block: createCompositeBlockSwitchField({
                label: <FormattedMessage id="welcomeEmail.image.fullWidth" defaultMessage="Full width" />,
                defaultValue: false,
            }),
        },
    },
});
