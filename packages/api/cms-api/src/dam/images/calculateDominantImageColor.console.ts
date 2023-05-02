import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { FileInterface } from "../files/entities/file.entity";
import { FileImage } from "../files/entities/file-image.entity";
import { FilesService } from "../files/files.service";

@Injectable()
@Console()
export class CalculateDominantImageColor {
    constructor(
        @InjectRepository("File") private readonly filesRepository: EntityRepository<FileInterface>,
        @InjectRepository(FileImage) private readonly fileImagesRepository: EntityRepository<FileImage>,
        private readonly fileService: FilesService,
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

                    await this.fileImagesRepository.persistAndFlush(file.image.assign({ dominantColor }));
                } else {
                    console.log(`No color was determined, ${file.image.id}`);
                }
            }
        }
        console.log("... done.");
    }
}
