import { ExtractBlockInputFactoryProps, YouTubeVideoBlock } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { datatype, random } from "faker";

// TODO: Remove when moving this block to the CMS - export it from youtube video block
enum AspectRatio {
    "16X9" = "16X9",
    "4X3" = "4X3",
}

@Injectable()
export class YouTubeVideoBlockFixtureService {
    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof YouTubeVideoBlock>> {
        const identifier = ["F_oOtaxb0L8", "Sklc_fQBmcs", "Xoz31I1FuiY", "bMknfKXIFA8"];
        const autoplay = datatype.boolean();

        return {
            autoplay,
            loop: datatype.boolean(),
            aspectRatio: random.arrayElement(Object.values(AspectRatio)),
            showControls: !autoplay,
            youtubeIdentifier: random.arrayElement(identifier),
        };
    }
}
