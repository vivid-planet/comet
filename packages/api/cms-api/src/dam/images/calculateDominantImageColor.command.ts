import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateRequestContext, EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Command, CommandRunner } from "nest-commander";

import { FileInterface } from "../files/entities/file.entity";
import { FilesService } from "../files/files.service";

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

        const files = await this.filesRepository.find({ image: { $ne: null } });

        console.log(`...for ${files.length} images ...`);

        for await (const file of files) {
            const dominantColor = await this.fileService.calculateDominantColor(file.contentHash);
            if (file.image) {
                if (dominantColor) {
                    console.log(`${dominantColor}, ${file.image.id}, ${file.name}`);

                    await this.em.persistAndFlush(file.image.assign({ dominantColor }));
                } else {
                    console.log(`No color was determined, ${file.image.id}`);
                }
            }
        }
        console.log("... done.");
    }
}
