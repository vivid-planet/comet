import { MjmlColumn, MjmlText, type PropsWithData } from "@comet/mail-react";
import { type RichTextBlockData } from "@src/blocks.generated";
import { IndentedSectionGroup } from "@src/brevo/components/IndentedSectionGroup";
import { type FC } from "react";
import { FormattedMessage } from "react-intl";

export const EmailCampaignSalutationBlock: FC<PropsWithData<RichTextBlockData>> = ({ data }) => {
    return (
        <IndentedSectionGroup>
            <MjmlColumn>
                <MjmlText>
                    <FormattedMessage id="salutationBlock.salutation" defaultMessage="Dear customer!" />
                </MjmlText>
            </MjmlColumn>
        </IndentedSectionGroup>
    );
};
