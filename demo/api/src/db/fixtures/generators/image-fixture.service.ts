import { download, FileInterface, FilesService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { DamScope } from "@src/dam/dto/dam-scope";
import { datatype } from "faker";
import * as fs from "fs/promises";
import path from "path";

@Injectable()
export class ImageFixtureService {
    private pixelImageFiles: FileInterface[] = [];
    private svgImageFiles: FileInterface[] = [];

    private imageFiles: FileInterface[] = [];
    constructor(private readonly filesService: FilesService) {}

    public getRandomPixelImage() {
        const randomIndex = datatype.number({
            min: 0,
            max: this.pixelImageFiles.length - 1,
        });
        return this.pixelImageFiles[randomIndex];
    }

    public getRandomSvg() {
        const randomIndex = datatype.number({
            min: 0,
            max: this.svgImageFiles.length - 1,
        });
        return this.svgImageFiles[randomIndex];
    }

    private async generateSvgImages(maximumImageCount: number, scope: DamScope): Promise<void> {
        const svgDirectoryPath = "./src/db/fixtures/assets/svgs";
        const files = await fs.readdir(path.resolve(svgDirectoryPath));

        let count = 0;
        for (const svg of files) {
            const file = await download(path.resolve(`${svgDirectoryPath}/${svg}`));
            file.mimetype = "image/svg+xml"; // mime type is undefined for svg files and wrongly typed in download function (a possible undefined type is typed as string)
            this.svgImageFiles.push(await this.filesService.upload(file, { scope }));
            count++;

            if (count === maximumImageCount) break;
        }
    }

    private async generatePixelImages(maximumImageCount: number, scope: DamScope): Promise<void> {
        for (let i = 0; i < maximumImageCount; i++) {
            const width = datatype.number({
                min: 1000,
                max: 3000,
            });
            const height = datatype.number({
                min: 1000,
                max: 3000,
            });

            const imageUrl = `https://source.unsplash.com/random/${width}x${height}`;
            const downloadedImage = await download(imageUrl);

            const image = await this.filesService.upload(downloadedImage, { scope });
            this.pixelImageFiles.push(image);
        }
    }

    public async generateImages(maximumImageCount: number, scope: DamScope): Promise<void> {
        console.log("Generate Pixel Images ...");
        await this.generatePixelImages(maximumImageCount, scope);

        console.log("Generate SVG Images ...");
        await this.generateSvgImages(maximumImageCount, scope);
    }
}
