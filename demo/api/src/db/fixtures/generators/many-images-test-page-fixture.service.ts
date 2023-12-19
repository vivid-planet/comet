import { PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { DamScope } from "@src/dam/dto/dam-scope";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { PageContentBlock } from "@src/pages/blocks/PageContentBlock";
import { PageInput } from "@src/pages/dto/page.input";
import { Page } from "@src/pages/entities/page.entity";
import { UserGroup } from "@src/user-groups/user-group";
import faker from "faker";

import { generateImageBlock } from "./blocks/image.generator";
import { generateSeoBlock } from "./blocks/seo.generator";
import { SvgImageFileFixtureService } from "./svg-image-file-fixture.service";
import { UnsplashImageFileFixtureService } from "./unsplash-image-file-fixture.service";

const IMAGES_NUMBER = 10;

@Injectable()
export class ManyImagesTestPageFixtureService {
    constructor(
        private readonly pageTreeService: PageTreeService,
        @InjectRepository(Page) private readonly pagesRespository: EntityRepository<Page>,
        private readonly unsplashImageFileFixtureService: UnsplashImageFileFixtureService,
        private readonly svgImageFileFixtureService: SvgImageFileFixtureService,
    ) {}

    async execute(): Promise<void> {
        const uuidDocument = "c66ebddd-ecd1-430c-9ea2-8a482c62ad70";

        const scope: PageTreeNodeScope = {
            domain: "main",
            language: "en",
        };

        const damScope: DamScope = {
            domain: "main",
        };

        const manyImagesTestPageTreeNode = await this.pageTreeService.createNode(
            {
                name: "Test many images",
                slug: "test-many-images",
                attachedDocument: {
                    id: uuidDocument,
                    type: "Page",
                },
            },
            PageTreeNodeCategory.MainNavigation,
            scope,
        );

        await this.pageTreeService.updateNodeVisibility(manyImagesTestPageTreeNode.id, PageTreeNodeVisibility.Published);

        const imageBlocks: ReturnType<typeof generateImageBlock>[] = [];
        for (let index = 0; index < IMAGES_NUMBER; index++) {
            const imageFile = await this.unsplashImageFileFixtureService.generateImage(damScope);
            imageBlocks.push(generateImageBlock(imageFile));
        }
        const svgFile = await this.svgImageFileFixtureService.generateImage(damScope);
        imageBlocks.push(generateImageBlock(svgFile));

        const pageInput = new PageInput();
        pageInput.seo = generateSeoBlock();
        pageInput.content = PageContentBlock.blockInputFactory({
            blocks: imageBlocks.map((c) => ({
                key: faker.datatype.uuid(),
                visible: true,
                type: "image",
                props: c,
                userGroup: UserGroup.All,
            })),
        });

        await this.pagesRespository.persistAndFlush(
            this.pagesRespository.create({
                id: uuidDocument,
                content: pageInput.content.transformToBlockData(),
                seo: pageInput.seo.transformToBlockData(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        );
    }
}
