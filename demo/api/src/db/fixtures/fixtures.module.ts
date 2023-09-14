import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { ConsoleModule } from "nestjs-console";

import { AnchorBlockFixtureService } from "./generators/blocks/anchor.fixture";
import { ColumnsBlockFixtureService } from "./generators/blocks/columns.fixture";
import { DamImageBlockFixtureService } from "./generators/blocks/dam-image.fixture";
import { DamVideoBlockFixtureService } from "./generators/blocks/dam-video.fixture";
import { FullWidthImageBlockFixtureService } from "./generators/blocks/full-width-image.fixture";
import { HeadlineBlockFixtureService } from "./generators/blocks/headline.fixture";
import { LinkBlockFixtureService } from "./generators/blocks/link.fixture";
import { LinkListBlockFixtureService } from "./generators/blocks/link-list.fixture";
import { MediaBlockFixtureService } from "./generators/blocks/media.fixture";
import { PageContentBlockFixtureService } from "./generators/blocks/page-content.fixture";
import { PixelImageBlockFixtureService } from "./generators/blocks/pixel-image.fixture";
import { RichTextBlockFixtureService } from "./generators/blocks/richtext.fixture";
import { SeoBlockFixtureService } from "./generators/blocks/seo.fixture";
import { SpaceBlockFixtureService } from "./generators/blocks/space.fixture";
import { SvgImageBlockFixtureService } from "./generators/blocks/svg-image.fixture";
import { TextImageBlockFixtureService } from "./generators/blocks/text-image.fixture";
import { TextLinkBlockFixtureService } from "./generators/blocks/text-link.fixture";
import { TwoListsBlockFixtureService } from "./generators/blocks/two-lists.fixture";
import { VideoBlockFixtureService } from "./generators/blocks/video.fixture";
import { YouTubeVideoBlockFixtureService } from "./generators/blocks/you-tube-video.fixture";
import { ImageFixtureService } from "./generators/image-fixture.service";
import { LinkFixtureService } from "./generators/link-fixture.service";
import { PageFixtureService } from "./generators/page-fixture.service";
import { PublicUploadsFixtureService } from "./generators/public-uploads-fixture.service";
import { VideoFixtureService } from "./generators/video-fixture.service";

@Module({
    imports: [ConfigModule, ConsoleModule, PagesModule, LinksModule],
    providers: [
        FixturesConsole,
        PageFixtureService,
        LinkFixtureService,
        PublicUploadsFixtureService,
        VideoFixtureService,
        ImageFixtureService,
        DamVideoBlockFixtureService,
        PageContentBlockFixtureService,
        RichTextBlockFixtureService,
        DamImageBlockFixtureService,
        SeoBlockFixtureService,
        TextImageBlockFixtureService,
        SpaceBlockFixtureService,
        HeadlineBlockFixtureService,
        AnchorBlockFixtureService,
        FullWidthImageBlockFixtureService,
        LinkBlockFixtureService,
        LinkListBlockFixtureService,
        YouTubeVideoBlockFixtureService,
        DamVideoBlockFixtureService,
        ColumnsBlockFixtureService,
        LinkBlockFixtureService,
        TextLinkBlockFixtureService,
        SvgImageBlockFixtureService,
        PixelImageBlockFixtureService,
        MediaBlockFixtureService,
        VideoBlockFixtureService,
        TwoListsBlockFixtureService,
    ],
})
export class FixturesModule {}
