import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";

import { FoldersService } from "./folders.service";

@Controller("dam/folders")
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) {}

    @Get("/:folderId/zip")
    async createZip(@Param("folderId") folderId: string, @Res() res: Response): Promise<void> {
        const folder = await this.foldersService.findOneById(folderId);
        const folderName = folder?.name ? folder.name : "folder";
        const zipStream = await this.foldersService.createZipStreamFromFolder(folderId);

        res.setHeader("Content-Disposition", `attachment; filename="${folderName || "folder"}.zip"`);
        res.setHeader("Content-Type", "application/zip");
        zipStream.pipe(res);
    }
}
