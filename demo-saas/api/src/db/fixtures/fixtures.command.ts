import { BlobStorageBackendService, DependenciesService } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { CreateRequestContext, MikroORM } from "@mikro-orm/postgresql";
import { Inject, Logger } from "@nestjs/common";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";
import { MultiBar, Options, Presets } from "cli-progress";
import { Command, CommandRunner } from "nest-commander";

import { FileUploadsFixtureService } from "./generators/file-uploads-fixture.service";
import { ImageFixtureService } from "./generators/image-fixture.service";
import { NewsFixtureService } from "./generators/news-fixture.service";
import { ProductsFixtureService } from "./generators/products-fixture.service";
import { VideoFixtureService } from "./generators/video-fixture.service";

@Command({
    name: "fixtures",
    description: "Create fixtures with faker.js",
})
export class FixturesCommand extends CommandRunner {
    private readonly logger = new Logger(FixturesCommand.name);

    barOptions: Options = {
        format: `{bar} {percentage}% | {value}/{total} {title} | ETA: {eta_formatted} | Duration: {duration_formatted}`,
        noTTYOutput: true,
    };

    constructor(
        @Inject(CONFIG) private readonly config: Config,
        private readonly blobStorageBackendService: BlobStorageBackendService,
        private readonly dependenciesService: DependenciesService,
        private readonly productsFixtureService: ProductsFixtureService,
        private readonly fileUploadsFixtureService: FileUploadsFixtureService,
        private readonly imageFixtureService: ImageFixtureService,
        private readonly orm: MikroORM,
        private readonly videoFixtureService: VideoFixtureService,
        private readonly newsFixtureService: NewsFixtureService,
    ) {
        super();
    }

    @CreateRequestContext()
    async run(): Promise<void> {
        // ensure repeatable runs
        faker.seed(123456);

        this.logger.log("Drop tables...");
        const connection = this.orm.em.getConnection();
        const tables = await connection.execute(`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename;`);

        for (const table of tables) {
            await connection.execute(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE`);
        }

        this.logger.log("Clear storage...");
        const damFilesDirectory = `${this.config.blob.storageDirectoryPrefix}-files`;
        if (await this.blobStorageBackendService.folderExists(damFilesDirectory)) {
            await this.blobStorageBackendService.removeFolder(damFilesDirectory);
        }
        await this.blobStorageBackendService.createFolder(damFilesDirectory);

        this.logger.log("Run migrations...");
        const migrator = this.orm.getMigrator();
        await migrator.up();

        const multiBar = new MultiBar(this.barOptions, Presets.shades_classic);

        this.logger.log("Generate Images...");
        await this.imageFixtureService.generateImages(5, { domain: "main" });

        this.logger.log("Generate Videos...");
        await this.videoFixtureService.generateVideos({ domain: "main" });

        this.logger.log("Generate File Uploads...");
        await this.fileUploadsFixtureService.generateFileUploads();

        await this.productsFixtureService.generate();

        await this.newsFixtureService.generate();

        multiBar.stop();

        await this.dependenciesService.createViews();

        await this.orm.em.flush();
    }
}
