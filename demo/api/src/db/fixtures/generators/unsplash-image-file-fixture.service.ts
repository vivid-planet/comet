import { createFileUploadInputFromUrl, FileInterface, FilesService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { DamScope } from "@src/dam/dto/dam-scope";
import faker from "faker";

@Injectable()
export class UnsplashImageFileFixtureService {
    constructor(private readonly filesService: FilesService) {}

    async generateImage(scope: DamScope): Promise<FileInterface> {
        const width = faker.datatype.number({
            min: 1000,
            max: 3000,
        });
        const height = faker.datatype.number({
            min: 1000,
            max: 3000,
        });

        const imageUrl = `https://source.unsplash.com/all/${width}x${height}`;
        console.log(`Downloading ${imageUrl}.`);
        const downloadedImage = await createFileUploadInputFromUrl(imageUrl);
        console.log(`Downloading ${imageUrl} done.`);
        console.log(`Uploading ${downloadedImage.originalname}.`);
        const file = await this.filesService.upload(downloadedImage, { scope });
        console.log(`Uploading ${downloadedImage.originalname} done.`);
        return file;
    }
}
