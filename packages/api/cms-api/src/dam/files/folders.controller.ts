import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";

import { FoldersService } from "./folders.service";

@Controller("dam/folders")
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) {}

    @Get("/:folderId/zip")
    async createZip(@Param("folderId") folderId: string, @Res() res: Response): Promise<void> {
        const folderName = await this.foldersService.findOneById(folderId);
        const zipBuffer = await this.foldersService.createZipStreamFromFolder(folderId);

        res.setHeader("Content-Disposition", `attachment; filename=${folderName?.name || "folderDownload"}.zip`);
        res.setHeader("Content-Type", "application/zip");
        zipBuffer.pipe(res);
    }
}
