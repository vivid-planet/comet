import { Injectable, Logger } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { isInjectableService } from "../helper/is-injectable-service.helper";
import { ENTITY_INFO_METADATA_KEY, EntityInfoGetter, EntityInfoInterface } from "./entity-info.decorator";

@Injectable()
export class EntityInfoService {
    private readonly logger = new Logger(EntityInfoService.name);

    constructor(private readonly moduleRef: ModuleRef) {}

    async getEntityInfo(instance: object): Promise<EntityInfoInterface | undefined> {
        const entityInfoGetter: EntityInfoGetter | undefined = Reflect.getMetadata(ENTITY_INFO_METADATA_KEY, instance.constructor);

        if (entityInfoGetter === undefined) {
            this.logger.warn(
                `Warning: ${instance.constructor.name} doesn't provide any entity info. You should add a @EntityInfo() decorator to the class. Otherwise it won't be displayed correctly as a dependency.`,
            );
            return undefined;
        }

        if (isInjectableService(entityInfoGetter)) {
            const service = this.moduleRef.get(entityInfoGetter, { strict: false });
            const { name, secondaryInformation } = await service.getEntityInfo(instance);
            return { name, secondaryInformation };
        } else {
            const { name, secondaryInformation } = await entityInfoGetter(instance);
            return { name, secondaryInformation };
        }
    }
}
