import { MjmlColumn, MjmlPixelImageBlock, MjmlSection, type PropsWithData } from "@comet/mail-react";
import type { MailImageBlockData } from "@src/blocks.generated";

export function MailImageBlock({ data }: PropsWithData<MailImageBlockData>) {
    return (
        <MjmlSection indent={!data.fullWidth}>
            <MjmlColumn>
                <MjmlPixelImageBlock data={data.image} width={data.fullWidth ? 600 : 536} aspectRatio="16x9" />
            </MjmlColumn>
        </MjmlSection>
    );
}
