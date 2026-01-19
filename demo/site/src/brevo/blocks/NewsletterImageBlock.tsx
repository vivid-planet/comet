import { ImageBlock, type PropsWithData } from "@comet/mail-react";
import { MjmlColumn, MjmlSection } from "@faire/mjml-react";
import { type NewsletterImageBlockData } from "@src/blocks.generated";

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
                <ImageBlock
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
