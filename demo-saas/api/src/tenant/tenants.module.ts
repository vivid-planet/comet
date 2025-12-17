import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserService } from "@src/auth/user.service";

import { CustomTenantUserResolver } from "./custom-tenant-user.resolver";
import { Tenant } from "./entities/tenant.entity";
import { TenantUser } from "./entities/tenant-user.entity";
import { TenantResolver } from "./generated/tenant.resolver";
import { TenantUserResolver } from "./generated/tenant-user.resolver";
import { TenantSubscriber } from "./tenants.subscriber";

@Module({
    imports: [MikroOrmModule.forFeature([Tenant, TenantUser]), MikroOrmModule.forFeature([Tenant], "admin")],
    providers: [TenantResolver, TenantUserResolver, CustomTenantUserResolver, UserService, TenantSubscriber],
})
export class TenantsModule {}
