import { download, File, FilesService } from "@comet/cms-api";
import path from "path";

const images = ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"];

export const generateImageFiles = async (filesService: FilesService): Promise<File[]> => {
    const files: File[] = [];

    for (const image of images) {
        const file = await download(path.resolve(`./src/db/fixtures/generators/images/${image}`));
        files.push(await filesService.upload(file));
    }

    return files;
};
