<<<<<<< HEAD
import { MjmlColumn, MjmlText, type PropsWithData } from "@dextinity/mail-react";
=======
import { MjmlColumn, MjmlSection, MjmlText, type PropsWithData } from "@comet/mail-react";
>>>>>>> main
import type { RichTextBlockData } from "@src/blocks.generated";
import type { FC } from "react";
import { FormattedMessage } from "react-intl";

export const EmailCampaignSalutationBlock: FC<PropsWithData<RichTextBlockData>> = ({ data }) => {
    return (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlText>
                    <FormattedMessage id="salutationBlock.salutation" defaultMessage="Dear customer!" />
                </MjmlText>
            </MjmlColumn>
        </MjmlSection>
    );
};
