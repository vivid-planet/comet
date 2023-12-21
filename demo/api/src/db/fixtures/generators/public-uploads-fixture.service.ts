import { download, PublicUpload, PublicUploadsService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import path from "path";

@Injectable()
export class PublicUploadsFixtureService {
    constructor(private readonly publicUploadsService: PublicUploadsService) {}

    async generatePublicUploads(): Promise<PublicUpload[]> {
        console.log("Generating public uploads...");

        const images = ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"];
        const publicUploads: PublicUpload[] = [];

        for (const image of images) {
            const file = await download(path.resolve(`./src/db/fixtures/generators/images/${image}`));
            publicUploads.push(await this.publicUploadsService.upload(file));
        }

        return publicUploads;
    }
}
