import { faker } from "@faker-js/faker";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { Department } from "@src/department/entities/department.entity";
import { Tenant } from "@src/tenant/entities/tenant.entity";

@Injectable()
export class TenantFixtureService {
    private logger = new Logger(TenantFixtureService.name);

    constructor(private readonly entityManager: EntityManager) {}

    async generate(): Promise<void> {
        this.logger.log("Generating tenants...");
        for (let i = 0; i < 5; i++) {
            const tenant = this.entityManager.create(Tenant, {
                id: faker.string.uuid(),
                name: faker.company.name(),
            });
            this.entityManager.persist(tenant);

            // generate 5 departments for each tenant
            for (let j = 0; j < 5; j++) {
                const department = this.entityManager.create(Department, {
                    id: faker.string.uuid(),
                    name: faker.company.name(),
                    tenant: tenant,
                });
                this.entityManager.persist(department);
            }
        }
        this.entityManager.flush();
    }
}
