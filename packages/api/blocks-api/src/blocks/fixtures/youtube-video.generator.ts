import faker from "faker";

import { ExtractBlockInputFactoryProps } from "../block";
import { AspectRatio, YouTubeVideoBlock } from "../youtube-video.block";

export const generateYoutubeVideoBlock = (urlsOrIdentifiers: string[]): ExtractBlockInputFactoryProps<typeof YouTubeVideoBlock> => {
    const autoplay = faker.datatype.boolean();

    return {
        youtubeIdentifier: faker.random.arrayElement(urlsOrIdentifiers),
        autoplay,
        showControls: !autoplay ? true : faker.datatype.boolean(),
        aspectRatio: faker.random.arrayElement(Object.values(AspectRatio)),
    };
};
