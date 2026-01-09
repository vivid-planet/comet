import { MjmlColumn, MjmlSection } from "@faire/mjml-react";

import { type NewsletterImageBlockData } from "../blocks.generated.js";
import { CommonImageBlock } from "./CommonImageBlock.js";
import { type PropsWithData } from "./helpers/PropsWithData.js";

interface NewsletterImageBlockProps extends PropsWithData<NewsletterImageBlockData> {
    desktopRenderWidth?: number;
    contentWidth?: number;
    validSizes: number[];
    baseUrl: string;
}

export const NewsletterImageBlock = ({ data, desktopRenderWidth, contentWidth, validSizes, baseUrl }: NewsletterImageBlockProps) => {
    return (
        <MjmlSection>
            <MjmlColumn>
                <CommonImageBlock
                    data={data.image}
                    desktopRenderWidth={desktopRenderWidth}
                    contentWidth={contentWidth}
                    validSizes={validSizes}
                    baseUrl={baseUrl}
                />
            </MjmlColumn>
        </MjmlSection>
    );
};
