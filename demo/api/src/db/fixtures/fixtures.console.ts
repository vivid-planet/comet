import { BlobStorageBackendService, PageTreeNodeInterface, PageTreeNodeVisibility } from "@comet/cms-api";
import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Inject, Injectable } from "@nestjs/common";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";
import { ImageFixtureService } from "@src/db/fixtures/generators/image-fixture.service";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import faker from "faker";
import { Command, Console } from "nestjs-console";

import { LinkFixtureService } from "./generators/link-fixture.service";
import { PageFixtureService } from "./generators/page-fixture.service";

@Injectable()
@Console()
export class FixturesConsole {
    constructor(
        @Inject(CONFIG) private readonly config: Config,
        private readonly blobStorageBackendService: BlobStorageBackendService,
        private readonly pageFixtureService: PageFixtureService,
        private readonly linkFixtureService: LinkFixtureService,
        private readonly imageFixtureService: ImageFixtureService,

        private readonly orm: MikroORM,
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
        await this.imageFixtureService.generateImages(10);

        console.log("Generate Page Tree...");
        const scope: PageTreeNodeScope = {
            domain: "main",
            language: "en",
        };

        const { node } = await this.pageFixtureService.generatePage({ name: "Home", scope });
        await this.pageFixtureService.generatePage({ name: "Sub", scope, parentId: node.id });

        for (let i = 0; i < 3; i++) {
            const { node } = await this.pageFixtureService.generatePage({ name: `Page ${i}`, scope });

            for (let subPageIndex = 0; subPageIndex < 3; subPageIndex++) {
                if (faker.datatype.boolean()) {
                    await this.pageFixtureService.generatePage({ name: `Sub-Page ${subPageIndex}`, scope, parentId: node.id });
                } else {
                    await this.linkFixtureService.generateLink({ name: `Sub-Link ${subPageIndex}`, scope, parentId: node.id });
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
                    const { node } = await this.pageFixtureService.generatePage({
                        name,
                        parentId: level > 0 ? faker.random.arrayElement(pages[level - 1]).id : undefined,
                        scope: { domain, language: "en" },
                        visibility: faker.random.arrayElement([
                            PageTreeNodeVisibility.Published,
                            PageTreeNodeVisibility.Unpublished,
                            PageTreeNodeVisibility.Archived,
                        ]),
                    });

                    pagesForLevel.push(node);
                    pagesCount++;
                }

                pages.push(pagesForLevel);
            }
            console.log(`Generated ${pagesCount} lorem ipsum pages for ${domain}`);
        }
    }
}
