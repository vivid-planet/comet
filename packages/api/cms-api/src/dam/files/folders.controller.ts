import { Controller, Get, NotFoundException, Param, Res } from "@nestjs/common";
import { Response } from "express";

import { FoldersService } from "./folders.service";

@Controller("dam/folders")
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) {}

    @Get("/:folderId/zip")
    async createZip(@Param("folderId") folderId: string, @Res() res: Response): Promise<void> {
        const folder = await this.foldersService.findOneById(folderId);
        if (!folder) {
            throw new NotFoundException("Folder not found");
        }
        const zipStream = await this.foldersService.createZipStreamFromFolder(folderId);

        res.setHeader("Content-Disposition", `attachment; filename="${folder.name}.zip"`);
        res.setHeader("Content-Type", "application/zip");
        zipStream.pipe(res);
    }
}
