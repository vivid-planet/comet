import { download, File, FilesService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import faker from "faker";

@Injectable()
export class ImageGeneratorService {
    constructor(private readonly filesService: FilesService) {}

    public async generateImages(imageCount: number): Promise<File[]> {
        const imageFiles = [];

        for (let i = 0; i < imageCount; i++) {
            const image = await this.generateImage();
            imageFiles.push(image);
        }

        return imageFiles;
    }

    private async generateImage(): Promise<File> {
        const width = faker.datatype.number({
            min: 1000,
            max: 3000,
        });
        const height = faker.datatype.number({
            min: 1000,
            max: 3000,
        });

        const imageUrl = `https://source.unsplash.com/random/${width}x${height}`;
        const downloadedImage = await download(imageUrl);
        return this.filesService.upload(downloadedImage);
    }
}
