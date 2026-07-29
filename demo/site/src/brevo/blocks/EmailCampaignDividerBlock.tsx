import { MjmlColumn, MjmlDivider } from "@dextinity/mail-react";
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
