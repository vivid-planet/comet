import { createFileUploadInputFromUrl, FileInterface, FilesService } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { DamScope } from "@src/dam/dto/dam-scope";
import { DamFile } from "@src/dam/entities/dam-file.entity";
import * as fs from "fs/promises";
import path from "path";

@Injectable()
export class VideoFixtureService {
    private videoFiles: FileInterface[] = [];

    constructor(
        private readonly filesService: FilesService,
        @InjectRepository(DamFile) readonly filesRepository: EntityRepository<FileInterface>,
        private readonly entityManager: EntityManager,
    ) {}

    public getRandomVideo() {
        const randomIndex = faker.number.int({
            min: 0,
            max: this.videoFiles.length - 1,
        });

        return this.videoFiles[randomIndex];
    }

    public async generateVideos(scope: DamScope): Promise<void> {
        const videoDirectoryPath = "./src/db/fixtures/assets/videos";
        const files = await fs.readdir(path.resolve(videoDirectoryPath));

        for (const video of files) {
            const file = await createFileUploadInputFromUrl(path.resolve(`${videoDirectoryPath}/${video}`));
            this.videoFiles.push(await this.filesService.upload(file, { scope }));
        }

        await this.entityManager.flush();
    }
}
