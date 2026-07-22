import { Controller, ForbiddenException, Get, Inject, NotFoundException, Optional, Param, Res, Type } from "@nestjs/common";
import { Response } from "express";

import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../../user-permissions/user-permissions.types";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { DamScopeInterface } from "../types";
import { FoldersService } from "./folders.service";

export const createFoldersController = ({ damBasePath }: { damBasePath: string }): Type<unknown> => {
    @Controller(`${damBasePath}/folders`)
    class FoldersController {
        constructor(
            @Inject(DAM_CONFIG) private readonly damConfig: DamConfig,
            private readonly foldersService: FoldersService,
            @Optional() @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface | undefined,
        ) {}

        private isAllowed(user: CurrentUser, scope: DamScopeInterface | undefined): boolean {
            if (this.damConfig.disableScopeAccessControl) {
                return true;
            }
            if (!this.accessControlService) {
                // Fail closed: without an access control service and without explicitly disabling it, deny access.
                return false;
            }
            return this.accessControlService.isAllowed(user, "dam", scope);
        }

        @RequiredPermission(["dam"], { skipScopeCheck: true }) // Scope is checked in method
        @Get("/:folderId/zip")
        async createZip(@Param("folderId") folderId: string, @Res() res: Response, @GetCurrentUser() user: CurrentUser): Promise<void> {
            const folder = await this.foldersService.findOneById(folderId);
            if (!folder) {
                throw new NotFoundException("Folder not found");
            }

            if (folder.scope && !this.isAllowed(user, folder.scope)) {
                throw new ForbiddenException("The current user is not allowed to access this scope and download this folder.");
            }

            const zipStream = await this.foldersService.createZipStreamFromFolder(folderId);

            res.setHeader("Content-Disposition", `attachment; filename="${folder.name}.zip"`);
            res.setHeader("Content-Type", "application/zip");
            res.setHeader("cache-control", "no-store");
            zipStream.pipe(res);
        }
    }

    return FoldersController;
};
