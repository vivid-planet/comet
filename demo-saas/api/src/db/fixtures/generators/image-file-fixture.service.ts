import { createFileUploadInputFromUrl, FileInterface, FilesService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { DamScope } from "@src/dam/dto/dam-scope";
import path from "path";

const IMAGE_FILE_PATHS = ["astronaut", "comet", "planet", "rocket", "sun"];

@Injectable()
export class ImageFileFixtureService {
    constructor(private readonly filesService: FilesService) {}

    async uploadImagesFromSrc(scope: DamScope): Promise<Array<FileInterface>> {
        const images = [];
        for (let index = 0; index < IMAGE_FILE_PATHS.length; index++) {
            console.log(`Downloading ${IMAGE_FILE_PATHS[index]}.`);
            const image_path = path.resolve(`./src/db/fixtures/assets/images/${IMAGE_FILE_PATHS[index]}.png`);

            const downloadedImage = await createFileUploadInputFromUrl(image_path);
            console.log(`Downloading ${IMAGE_FILE_PATHS[index]} done.`);

            console.log(`Uploading ${downloadedImage.originalname}.`);
            const file = await this.filesService.upload(downloadedImage, { scope });
            console.log(`Uploading ${downloadedImage.originalname} done.`);
            images.push(file);
        }
        return images;
    }
}
