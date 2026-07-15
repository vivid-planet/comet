import { createTipTapRichTextBlock, MjmlColumn, MjmlSection, type PropsWithData } from "@comet/mail-react";
import type { MailTipTapRichTextBlockData, PhoneLinkBlockData } from "@src/blocks.generated";

const { MjmlTipTapRichTextBlock } = createTipTapRichTextBlock({
    blockTypes: {
        paragraph: { variant: "copy" },
    },
    textBlockStyles: {
        title: { variant: "title" },
        header: { variant: "header" },
    },
    linkTypes: {
        phone: (props: PhoneLinkBlockData) => (props.phone ? `tel:${props.phone}` : undefined),
    },
});

export function MailTipTapRichTextBlock({ data }: PropsWithData<MailTipTapRichTextBlockData>) {
    return (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlTipTapRichTextBlock data={data} />
            </MjmlColumn>
        </MjmlSection>
    );
}
