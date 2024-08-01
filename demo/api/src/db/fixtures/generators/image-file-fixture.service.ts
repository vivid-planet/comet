import { FileInterface, FilesService, FileUploadService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { DamScope } from "@src/dam/dto/dam-scope";
import path from "path";

const IMAGE_FILE_PATHS = ["astronaut", "comet", "planet", "rocket", "sun"];

@Injectable()
export class ImageFileFixtureService {
    constructor(private readonly filesService: FilesService, private readonly fileUploadService: FileUploadService) {}

    async uploadImagesFromSrc(scope: DamScope): Promise<Array<FileInterface>> {
        const images = [];
        for (let index = 0; index < IMAGE_FILE_PATHS.length; index++) {
            console.log(`Downloading ${IMAGE_FILE_PATHS[index]}.`);
            const image_path = path.resolve(`./src/db/fixtures/generators/images/${IMAGE_FILE_PATHS[index]}.png`);

            const downloadedImage = await this.fileUploadService.createFileUploadInputFromUrl(image_path);
            console.log(`Downloading ${IMAGE_FILE_PATHS[index]} done.`);
            downloadedImage.mimetype = "image/png";
            downloadedImage.originalname = `${IMAGE_FILE_PATHS[index]}.png`;

            console.log(`Uploading ${downloadedImage.originalname}.`);

            const file = await this.filesService.upload(downloadedImage, { scope });
            console.log(`Uploading ${downloadedImage.originalname} done.`);
            images.push(file);
        }
        return images;
    }
}
