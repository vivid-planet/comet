import { Module } from "@nestjs/common";

import { UserPermissionConfigService } from "./config.service";

@Module({
    imports: [],
    providers: [UserPermissionConfigService],
    exports: [UserPermissionConfigService],
})
export class UserPermissionModule {}
