import { download, File, FilesService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import faker from "faker";

@Injectable()
export class ImageFixtureService {
    private imageFiles: File[] = [];
    constructor(private readonly filesService: FilesService) {}

    public getRandomImage() {
        const randomIndex = faker.datatype.number({
            min: 0,
            max: this.imageFiles.length - 1,
        });
        return this.imageFiles[randomIndex];
    }

    public async generateImages(imageCount: number): Promise<void> {
        this.imageFiles = [];
        for (let i = 0; i < imageCount; i++) {
            const image = await this.generateImage();
            this.imageFiles.push(image);
        }
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
