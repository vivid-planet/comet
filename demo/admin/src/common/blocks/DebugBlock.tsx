import { createCompositeBlock, createCompositeBlockTextField } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

export const DebugBlock = createCompositeBlock({
    name: "Debug",
    displayName: <FormattedMessage id="debugBlock.displayName" defaultMessage="Debug" />,
    blocks: {
        title: {
            block: createCompositeBlockTextField({
                fieldProps: {
                    fullWidth: true,
                    label: <FormattedMessage id="debugBlock.title" defaultMessage="Title" />,
                },
            }),
        },
    },
});
