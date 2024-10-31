import { createFileUploadInputFromUrl, FileInterface, FilesService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { DamScope } from "@src/dam/dto/dam-scope";
import path from "path";

@Injectable()
export class SvgImageFileFixtureService {
    constructor(private readonly filesService: FilesService) {}

    async generateImage(scope: DamScope): Promise<FileInterface> {
        const file = await createFileUploadInputFromUrl(path.resolve(`./src/db/fixtures/generators/images/comet-logo-claim.svg`));
        return this.filesService.upload(file, { scope });
    }
}
