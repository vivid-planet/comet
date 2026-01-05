import { MjmlColumn, MjmlSection } from "@faire/mjml-react";

import { type NewsletterImageBlockData } from "../blocks.generated";
import { CommonImageBlock } from "./CommonImageBlock";
import { type PropsWithData } from "./helpers/PropsWithData";

interface NewsletterImageBlockProps extends PropsWithData<NewsletterImageBlockData> {
    desktopRenderWidth?: number;
    contentWidth?: number;
}

export const NewsletterImageBlock = ({ data, desktopRenderWidth, contentWidth }: NewsletterImageBlockProps) => {
    return (
        <MjmlSection>
            <MjmlColumn>
                <CommonImageBlock data={data.image} desktopRenderWidth={desktopRenderWidth} contentWidth={contentWidth} />
            </MjmlColumn>
        </MjmlSection>
    );
};
