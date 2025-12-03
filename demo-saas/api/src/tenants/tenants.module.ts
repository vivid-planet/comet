import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

import { Tenant } from "./entities/tenant.entity";
import { TenantSubscriber } from "./tenants.subscriber";

@Module({
    imports: [MikroOrmModule.forFeature([Tenant])],
    providers: [
        TenantSubscriber,
        {
            provide: AsyncLocalStorage,
            useValue: new AsyncLocalStorage(),
        },
    ],
})
export class TenantsModule {}
