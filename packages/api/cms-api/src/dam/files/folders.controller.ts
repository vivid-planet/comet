import { Controller, ForbiddenException, Get, Inject, NotFoundException, Optional, Param, Res, Type } from "@nestjs/common";
import { Response } from "express";

import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../../user-permissions/user-permissions.types";
import { FoldersService } from "./folders.service";

export const createFoldersController = ({
    damBasePath,
    disableScopeAccessControl = false,
}: {
    damBasePath: string;
    disableScopeAccessControl?: boolean;
}): Type<unknown> => {
    @Controller(`${damBasePath}/folders`)
    class FoldersController {
        constructor(
            private readonly foldersService: FoldersService,
            @Optional() @Inject(ACCESS_CONTROL_SERVICE) private accessControlService?: AccessControlServiceInterface,
        ) {}

        // Fail closed: without an access control service the scope check below would be silently skipped, leaving the
        // endpoint unauthorized. Require the consuming application to opt out explicitly when it handles authorization itself.
        private assertScopeAccessControlAvailable(): void {
            if (!this.accessControlService && !disableScopeAccessControl) {
                throw new ForbiddenException(
                    "DAM scope access control is not available. Register an access control service or set `disableScopeAccessControl: true` on the DAM module to handle authorization outside of the DAM module.",
                );
            }
        }

        @RequiredPermission(["dam"], { skipScopeCheck: true }) // Scope is checked in method
        @Get("/:folderId/zip")
        async createZip(@Param("folderId") folderId: string, @Res() res: Response, @GetCurrentUser() user: CurrentUser): Promise<void> {
            this.assertScopeAccessControlAvailable();

            const folder = await this.foldersService.findOneById(folderId);
            if (!folder) {
                throw new NotFoundException("Folder not found");
            }

            if (folder.scope && this.accessControlService && !this.accessControlService.isAllowed(user, "dam", folder.scope)) {
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
