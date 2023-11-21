import { download, FileInterface, FilesService } from "@comet/cms-api";
import { DamScope } from "@src/dam/dto/dam-scope";
import path from "path";

const images = ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"];

export const generateImageFiles = async (filesService: FilesService, scope: DamScope): Promise<FileInterface[]> => {
    const files: FileInterface[] = [];

    for (const image of images) {
        const file = await download(path.resolve(`./src/db/fixtures/generators/images/${image}`));
        files.push(await filesService.upload(file, { scope }));
    }

    return files;
};
