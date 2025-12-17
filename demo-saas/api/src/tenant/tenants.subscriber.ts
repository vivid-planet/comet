import { EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Product } from "@src/products/entities/product.entity";

@Injectable()
export class TenantSubscriber implements EventSubscriber {
    constructor(readonly entityManager: EntityManager) {
        entityManager.getEventManager().registerSubscriber(this);
    }

    async beforeCreate(args: EventArgs<Product>) {
        // Only apply to entities with a `tenant` property
        if (!("tenant" in args.entity)) return;

        // Get the tenant ID from the current DB session
        const result = await this.entityManager.execute(`SELECT current_setting('app.tenant', true) as "tenantId"`);
        const tenantId = result[0]?.tenantId;

        if (!tenantId) return;

        // Assign tenant automatically
        if (!args.entity.tenant) {
            this.entityManager.assign(args.entity, { tenant: tenantId });
        }
    }
}
