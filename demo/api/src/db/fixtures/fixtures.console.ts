import { BlobStorageBackendService, FilesService, PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";
import { generateSeoBlock } from "@src/db/fixtures/generators/blocks/seo.generator";
import { DocumentGeneratorService } from "@src/db/fixtures/generators/document-generator.service";
import { ImageGeneratorService } from "@src/db/fixtures/generators/image-generator.service";
import { Link } from "@src/links/entities/link.entity";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { PageContentBlock } from "@src/pages/blocks/page-content.block";
import { PageInput } from "@src/pages/dto/page.input";
import { Page } from "@src/pages/entities/page.entity";
import faker from "faker";
import { Command, Console } from "nestjs-console";
import slugify from "slugify";

const getDefaultPageInput = (): PageInput => {
    const pageInput = new PageInput();
    pageInput.seo = generateSeoBlock();
    pageInput.content = PageContentBlock.blockInputFactory({ blocks: [] });
    return pageInput;
};

@Injectable()
@Console()
export class FixturesConsole {
    constructor(
        @Inject(CONFIG) private readonly config: Config,
        private readonly blobStorageBackendService: BlobStorageBackendService,
        private readonly pageTreeService: PageTreeService,
        private readonly filesService: FilesService,
        private readonly documentGeneratorService: DocumentGeneratorService,
        private readonly imageGeneratorService: ImageGeneratorService,
        private readonly orm: MikroORM,
        @InjectRepository(Page) private readonly pagesRepository: EntityRepository<Page>,
        @InjectRepository(Link) private readonly linksRepository: EntityRepository<Link>,
    ) {}

    @Command({
        command: "fixtures",
        description: "Create fixtures with faker.js",
    })
    @UseRequestContext()
    async execute(): Promise<void> {
        // ensure repeatable runs
        faker.seed(123456);

        const damFilesDirectory = `${this.config.blob.storageDirectoryPrefix}-files`;
        if (await this.blobStorageBackendService.folderExists(damFilesDirectory)) {
            await this.blobStorageBackendService.removeFolder(damFilesDirectory);
        }
        await this.blobStorageBackendService.createFolder(damFilesDirectory);
        console.log("Storage cleared");

        const generator = this.orm.getSchemaGenerator();
        console.log(`Drop and recreate schema...`);
        await generator.dropSchema({ dropDb: false, dropMigrationsTable: true });

        console.log(`Run migrations...`);
        const migrator = this.orm.getMigrator();
        await migrator.up();

        console.log("Generate Images...");
        const imageFiles = await this.imageGeneratorService.generateImages(10);

        console.log("Generate Page Tree...");
        const scope: PageTreeNodeScope = {
            domain: "main",
            language: "en",
        };

        const node = await this.documentGeneratorService.generatePage({ name: "Home", scope, imageFiles });
        await this.documentGeneratorService.generatePage({ name: "Sub", scope, imageFiles, parentId: node.id });

        for (let i = 0; i < 3; i++) {
            const page = await this.documentGeneratorService.generatePage({ name: `Page ${i}`, scope, imageFiles });

            for (let subPageIndex = 0; subPageIndex < 3; subPageIndex++) {
                if (faker.datatype.boolean()) {
                    await this.documentGeneratorService.generatePage({ name: `Sub-Page ${subPageIndex}`, scope, imageFiles, parentId: page.id });
                } else {
                    await this.documentGeneratorService.generateLink({ name: `Sub-Link ${subPageIndex}`, scope, imageFiles, parentId: page.id });
                }
            }
        }

        console.log("generate lorem ispum fixtures");

        const NUMBER_OF_DOMAINS_WITH_LORUM_IPSUM_CONTENT = 0; // Increase number to generate lorum ipsum fixtures

        for (let domainNum = 0; domainNum < NUMBER_OF_DOMAINS_WITH_LORUM_IPSUM_CONTENT; domainNum++) {
            const domain = domainNum === 0 ? "secondary" : `${faker.random.word().toLowerCase()}.com`;
            let pagesCount = 0;
            const pages = [];
            for (let level = 0; level < 10; level++) {
                const pagesForLevel: PageTreeNodeInterface[] = [];

                for (let i = 0; i < faker.datatype.number({ min: 100, max: 200 }); i++) {
                    const name = faker.lorem.sentence();
                    const page = await this.pageTreeService.createNode(
                        {
                            name: name,
                            slug: slugify(name),
                            parentId: level > 0 ? faker.random.arrayElement(pages[level - 1]).id : undefined,
                            attachedDocument: { type: "Page" },
                        },
                        PageTreeNodeCategory.MainNavigation,
                        {
                            domain,
                            language: "en",
                        },
                    );
                    pagesForLevel.push(page);
                    pagesCount++;

                    const pageInput = getDefaultPageInput();

                    const pageId = faker.datatype.uuid();

                    await this.pagesRepository.persistAndFlush(
                        this.pagesRepository.create({
                            id: pageId,
                            content: pageInput.content.transformToBlockData(),
                            seo: pageInput.seo.transformToBlockData(),
                        }),
                    );
                    await this.pageTreeService.attachDocument({ id: pageId, type: "Page" }, page.id);

                    await this.pageTreeService.updateNodeVisibility(
                        page.id,
                        faker.random.arrayElement([
                            PageTreeNodeVisibility.Published,
                            PageTreeNodeVisibility.Unpublished,
                            PageTreeNodeVisibility.Archived,
                        ]),
                    );
                }

                pages.push(pagesForLevel);
            }
            console.log(`Generated ${pagesCount} lorem ipsum pages for ${domain}`);
        }
    }
}
