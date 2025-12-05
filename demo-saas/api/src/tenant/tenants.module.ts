import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Tenant } from "./entities/tenant.entity";
import { TenantScope } from "./entities/tenant-scope.entity";
import { TenantResolver } from "./generated/tenant.resolver";
import { TenantScopeResolver } from "./generated/tenant-scope.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Tenant, TenantScope])],
    providers: [TenantResolver, TenantScopeResolver],
})
export class TenantsModule {}
