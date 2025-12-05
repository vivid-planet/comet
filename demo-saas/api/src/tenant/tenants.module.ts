import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Tenant } from "./entities/tenant.entity";
import { TenantResolver } from "./generated/tenant.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Tenant])],
    providers: [TenantResolver],
})
export class TenantsModule {}
