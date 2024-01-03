import { Controller, ForbiddenException, Get, NotFoundException, Param, Res } from "@nestjs/common";
import { Response } from "express";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { ContentScopeService } from "../../content-scope/content-scope.service";
import { FoldersService } from "./folders.service";

@Controller("dam/folders")
export class FoldersController {
    constructor(private readonly foldersService: FoldersService, private readonly contentScopeService: ContentScopeService) {}

    @Get("/:folderId/zip")
    async createZip(@Param("folderId") folderId: string, @Res() res: Response, @GetCurrentUser() user: CurrentUserInterface): Promise<void> {
        const folder = await this.foldersService.findOneById(folderId);
        if (!folder) {
            throw new NotFoundException("Folder not found");
        }

        if (folder.scope !== undefined && !this.contentScopeService.canAccessScope(folder.scope, user)) {
            throw new ForbiddenException("The current user is not allowed to access this scope and download this folder.");
        }

        const zipStream = await this.foldersService.createZipStreamFromFolder(folderId);

        res.setHeader("Content-Disposition", `attachment; filename="${folder.name}.zip"`);
        res.setHeader("Content-Type", "application/zip");
        zipStream.pipe(res);
    }
}
