import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@comet/blocks-admin";
import { StandaloneCallToActionListBlockData } from "@src/blocks.generated";
import { CallToActionListBlock } from "@src/common/blocks/CallToActionListBlock";
import { FormattedMessage } from "react-intl";

export const StandaloneCallToActionListBlock = createCompositeBlock(
    {
        name: "StandaloneCallToActionList",
        displayName: <FormattedMessage id="standaloneCallToActionList.displayName" defaultMessage="CallToActionList" />,
        blocks: {
            callToActionList: {
                block: CallToActionListBlock,
            },
            alignment: {
                block: createCompositeBlockSelectField<StandaloneCallToActionListBlockData["alignment"]>({
                    defaultValue: "left",
                    options: [
                        { value: "left", label: <FormattedMessage id="standaloneCallToActionList.alignment.left" defaultMessage="left" /> },
                        { value: "center", label: <FormattedMessage id="standaloneCallToActionList.alignment.center" defaultMessage="center" /> },
                        { value: "right", label: <FormattedMessage id="standaloneCallToActionList.alignment.right" defaultMessage="right" /> },
                    ],
                    fieldProps: {
                        label: <FormattedMessage id="standaloneCallToActionList.alignment" defaultMessage="Alignment" />,
                        fullWidth: true,
                    },
                }),
                hiddenInSubroute: true,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Navigation;
        return block;
    },
);
