import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateRequestContext, EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Command, CommandRunner } from "nest-commander";

import { FileInterface } from "../files/entities/file.entity.js";
import { FilesService } from "../files/files.service.js";

@Command({
    name: "cms.dam.calculateDominantImageColor",
    description: "Recalculate and save dominant color of image",
})
export class CalculateDominantImageColorCommand extends CommandRunner {
    constructor(
        @InjectRepository("DamFile") private readonly filesRepository: EntityRepository<FileInterface>,
        private readonly fileService: FilesService,
        private readonly em: EntityManager,
    ) {
        super();
    }

    @CreateRequestContext()
    async run(): Promise<void> {
        console.log("Calculate dominant color of images...");

        const qb = this.filesRepository.createQueryBuilder("file").leftJoinAndSelect("file.image", "image").where("image IS NOT NULL");
        const files = await qb.getResult();

        console.log(`...for ${files.length} images ...`);

        for await (const file of files) {
            const dominantColor = await this.fileService.calculateDominantColor(file.contentHash);
            if (file.image) {
                if (dominantColor) {
                    console.log(`${dominantColor}, ${file.image.id}`);

                    await this.em.persistAndFlush(file.image.assign({ dominantColor }));
                } else {
                    console.log(`No color was determined, ${file.image.id}`);
                }
            }
        }
        console.log("... done.");
    }
}
