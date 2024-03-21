import { FileInterface, FilesService, FileUploadService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { DamScope } from "@src/dam/dto/dam-scope";
import path from "path";

@Injectable()
export class SvgImageFileFixtureService {
    constructor(private readonly filesService: FilesService, private readonly fileUploadService: FileUploadService) {}

    async generateImage(scope: DamScope): Promise<FileInterface> {
        const file = await this.fileUploadService.createFileUploadInputFromUrl(
            path.resolve(`./src/db/fixtures/generators/images/comet-logo-claim.svg`),
        );
        // Convert to what the browser would send
        file.mimetype = "image/svg+xml";
        file.originalname = "comet-logo-claim.svg";
        return this.filesService.upload(file, { scope });
    }
}
