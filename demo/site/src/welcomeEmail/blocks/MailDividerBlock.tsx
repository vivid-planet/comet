import { MjmlColumn, MjmlDivider, MjmlSection } from "@comet/mail-react";

export function MailDividerBlock() {
    return (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlDivider />
            </MjmlColumn>
        </MjmlSection>
    );
}
