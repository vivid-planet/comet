import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Department } from "./entities/department.entity";
import { Tenant } from "./entities/tenant.entity";
import { DepartmentResolver } from "./generated/department.resolver";
import { TenantResolver } from "./generated/tenant.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Tenant, Department])],
    providers: [TenantResolver, DepartmentResolver],
})
export class TenantsModule {}
