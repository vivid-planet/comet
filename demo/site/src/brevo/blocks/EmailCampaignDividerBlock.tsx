import { MjmlColumn, MjmlDivider } from "@faire/mjml-react";
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
