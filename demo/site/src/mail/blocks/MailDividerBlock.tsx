import { MjmlColumn, MjmlDivider, MjmlSection } from "@comet/mail-react";

export const MailDividerBlock = () => {
    return (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlDivider />
            </MjmlColumn>
        </MjmlSection>
    );
};
