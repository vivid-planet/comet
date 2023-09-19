import { download, FileInterface, FilesService } from "@comet/cms-api";
import { DamScope } from "@src/dam/dto/dam-scope";
import path from "path";

export class SvgImageFileFixture {
    constructor(private filesService: FilesService) {}
    async generateImage(scope: DamScope): Promise<FileInterface> {
        const file = await download(path.resolve(`./src/db/fixtures/generators/images/comet-logo-claim.svg`));
        // Convert to what the browser would send
        file.mimetype = "image/svg+xml";
        file.originalname = "comet-logo-claim.svg";
        return this.filesService.upload(file, { scope });
    }
}
