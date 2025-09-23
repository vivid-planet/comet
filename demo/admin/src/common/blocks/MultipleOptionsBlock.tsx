import { createCompositeBlock, createCompositeBlockSelectField } from "@comet/cms-admin";
import { type MultipleOptionsBlockData } from "@src/blocks.generated";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const options: Array<{
    value: MultipleOptionsBlockData["options"];
    label: ReactNode;
}> = [
    {
        value: "option1",
        label: <FormattedMessage id="option1" defaultMessage="Option 1" />,
    },
    {
        value: "option2",
        label: <FormattedMessage id="option2" defaultMessage="Option 2" />,
    },
    {
        value: "option3",
        label: <FormattedMessage id="option3" defaultMessage="Option 3" />,
    },
];

export const MultipleOptionsBlock = createCompositeBlock({
    name: "MultipleOptions",
    displayName: <FormattedMessage id="multipleOptionsBlock.displayName" defaultMessage="Multiple Options" />,
    blocks: {
        options: {
            block: createCompositeBlockSelectField<MultipleOptionsBlockData["options"]>({
                defaultValue: "option1",
                label: <FormattedMessage id="multipleOptions.options" defaultMessage="Options" />,
                options: options,
                multiple: true,
                fullWidth: true,
            }),
        },
    },
});
