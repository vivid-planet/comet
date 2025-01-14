import { Field } from "@comet/admin";
import { createFinalFormBlock } from "@comet/blocks-admin";
import { createRichTextBlock } from "@comet/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const FieldInfoTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic", "sub", "sup", "non-breaking-space", "soft-hyphen"],
    },
    // @ts-expect-error Will be fixed with https://vivid-planet.atlassian.net/browse/COM-1522
    minHeight: "40px",
});

const FinalFormFieldInfoTextBlock = createFinalFormBlock(FieldInfoTextBlock);

type FieldInfoTextBlockFieldProps = {
    name?: string;
    label?: ReactNode;
};

export const FieldInfoTextBlockField = ({
    name = "infoText",
    label = <FormattedMessage id="formBuilder.infoText" defaultMessage="Info Text" />,
}: FieldInfoTextBlockFieldProps) => <Field label={label} name={name} component={FinalFormFieldInfoTextBlock} fullWidth />;
