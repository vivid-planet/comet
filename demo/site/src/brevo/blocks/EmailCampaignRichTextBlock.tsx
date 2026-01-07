import { type PropsWithData } from "@comet/mail-react";
import { MjmlColumn } from "@faire/mjml-react";
import { type RichTextBlockData } from "@src/blocks.generated";
import { IndentedSectionGroup } from "@src/brevo/components/IndentedSectionGroup";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { type FC } from "react";

export const EmailCampaignRichTextBlock: FC<PropsWithData<RichTextBlockData>> = ({ data }) => {
    return (
        <IndentedSectionGroup>
            <MjmlColumn>
                <RichTextBlock data={data} />
            </MjmlColumn>
        </IndentedSectionGroup>
    );
};
