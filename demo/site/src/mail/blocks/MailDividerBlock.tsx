import { MjmlColumn, MjmlDivider } from "@comet/mail-react";
import { IndentedSectionGroup } from "@src/mail/components/IndentedSectionGroup";

export const MailDividerBlock = () => {
    return (
        <IndentedSectionGroup>
            <MjmlColumn>
                <MjmlDivider />
            </MjmlColumn>
        </IndentedSectionGroup>
    );
};
