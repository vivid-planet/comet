import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { FileInterface } from "../files/entities/file.entity";
import { DamFileImage } from "../files/entities/file-image.entity";
import { FilesService } from "../files/files.service";

@Injectable()
@Console()
export class CalculateDominantImageColor {
    constructor(
        @InjectRepository("DamFile") private readonly filesRepository: EntityRepository<FileInterface>,
        @InjectRepository(DamFileImage) private readonly fileImagesRepository: EntityRepository<DamFileImage>,
        private readonly fileService: FilesService,
        private readonly entityManager: EntityManager,
    ) {}

    @Command({
        command: "cms.dam.calculateDominantImageColor",
        description: "Recalculate and save dominant color of image",
    })
    async calculate(): Promise<void> {
        console.log("Calculate dominant color of images...");

        const qb = this.filesRepository.createQueryBuilder("file").leftJoinAndSelect("file.image", "image").where("file.image IS NOT NULL");
        const files = await qb.getResult();

        console.log(`...for ${files.length} images ...`);

        for await (const file of files) {
            const dominantColor = await this.fileService.calculateDominantColor(file.contentHash);
            if (file.image) {
                if (dominantColor) {
                    console.log(`${dominantColor}, ${file.image.id}`);

                    await this.entityManager.persistAndFlush(file.image.assign({ dominantColor }));
                } else {
                    console.log(`No color was determined, ${file.image.id}`);
                }
            }
        }
        console.log("... done.");
    }
}
