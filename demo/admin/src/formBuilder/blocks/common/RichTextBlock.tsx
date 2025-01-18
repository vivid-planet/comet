import { Field, FieldProps } from "@comet/admin";
import { createFinalFormBlock } from "@comet/blocks-admin";
import { createRichTextBlock } from "@comet/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const RichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic", "sub", "sup", "non-breaking-space", "soft-hyphen"],
    },
    // @ts-expect-error Will be fixed with https://vivid-planet.atlassian.net/browse/COM-1522
    minHeight: "40px",
});

const FinalFormRichTextBlock = createFinalFormBlock(RichTextBlock);

type HelperTextFieldProps = {
    name?: string;
    label?: ReactNode;
};

export const HelperTextBlockField = ({
    name = "helperText",
    label = <FormattedMessage id="formBuilder.common.helperText" defaultMessage="Helper Text" />,
}: HelperTextFieldProps) => <RichTextBlockField label={label} name={name} />;

export const RichTextBlockField = (p: FieldProps) => <Field component={FinalFormRichTextBlock} fullWidth {...p} />;
