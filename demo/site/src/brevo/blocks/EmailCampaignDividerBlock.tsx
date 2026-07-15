import { MjmlColumn, MjmlDivider } from "@comet/mail-react";
import { IndentedSectionGroup } from "@src/brevo/components/IndentedSectionGroup";

export const EmailCampaignDividerBlock = () => {
    return (
        <IndentedSectionGroup>
            <MjmlColumn>
                <MjmlDivider />
            </MjmlColumn>
        </IndentedSectionGroup>
    );
};
