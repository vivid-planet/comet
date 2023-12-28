import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module";
import { FixturesConsole } from "@src/db/fixtures/fixtures.console";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { ConsoleModule } from "nestjs-console";

import { AnchorBlockFixtureService } from "./generators/blocks/anchor-block-fixture.service";
import { ColumnsBlockFixtureService } from "./generators/blocks/columns-block-fixture.service";
import { DamImageBlockFixtureService } from "./generators/blocks/dam-image-block-fixture.service";
import { DamVideoBlockFixtureService } from "./generators/blocks/dam-video-block-fixture.service";
import { FullWidthImageBlockFixtureService } from "./generators/blocks/full-width-image-block-fixture.service";
import { HeadlineBlockFixtureService } from "./generators/blocks/headline-block-fixture.service";
import { LinkBlockFixtureService } from "./generators/blocks/link-block-fixture.service";
import { LinkListBlockFixtureService } from "./generators/blocks/link-list-block-fixture.service";
import { MediaBlockFixtureService } from "./generators/blocks/media-block-fixture.service";
import { PageContentBlockFixtureService } from "./generators/blocks/page-content-block-fixture.service";
import { PixelImageBlockFixtureService } from "./generators/blocks/pixel-image-block-fixture.service";
import { RichTextBlockFixtureService } from "./generators/blocks/richtext-block-fixture.service";
import { SeoBlockFixtureService } from "./generators/blocks/seo-block-fixture.service";
import { SpaceBlockFixtureService } from "./generators/blocks/space-block-fixture.service";
import { SvgImageBlockFixtureService } from "./generators/blocks/svg-image-block-fixture.service";
import { TextImageBlockFixtureService } from "./generators/blocks/text-image-block-fixture.service";
import { TextLinkBlockFixtureService } from "./generators/blocks/text-link-block-fixture.service";
import { TwoListsBlockFixtureService } from "./generators/blocks/two-lists-block-fixture.service";
import { VideoBlockFixtureService } from "./generators/blocks/video-block-fixture.service";
import { YouTubeVideoBlockFixtureService } from "./generators/blocks/you-tube-video-block-fixture.service";
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
