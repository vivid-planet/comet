import { Injectable, Logger, Type } from "@nestjs/common";
import { INJECTABLE_WATERMARK } from "@nestjs/common/constants";
import { ModuleRef } from "@nestjs/core";

import { EntityInfoGetter, EntityInfoInterface, EntityInfoServiceInterface } from "./entity-info.decorator";

@Injectable()
export class EntityInfoService {
    private readonly logger = new Logger(EntityInfoService.name);

    constructor(private readonly moduleRef: ModuleRef) {}

    async getEntityInfo(instance: object): Promise<EntityInfoInterface | undefined> {
        const entityInfoGetter: EntityInfoGetter | undefined = Reflect.getMetadata(`data:entityInfo`, instance.constructor);

        if (entityInfoGetter === undefined) {
            this.logger.warn(
                `Warning: ${instance.constructor.name} doesn't provide any entity info. You should add a @EntityInfo() decorator to the class. Otherwise it won't be displayed correctly as a dependency.`,
            );
            return undefined;
        }

        if (this.isService(entityInfoGetter)) {
            const service = this.moduleRef.get(entityInfoGetter, { strict: false });
            const { name, secondaryInformation } = await service.getEntityInfo(instance);
            return { name, secondaryInformation };
        } else {
            const { name, secondaryInformation } = await entityInfoGetter(instance);
            return { name, secondaryInformation };
        }
    }

    private isService(entityInfoGetter: EntityInfoGetter): entityInfoGetter is Type<EntityInfoServiceInterface> {
        // Check if class has @Injectable() decorator -> if true it's a service class else it's a function
        return Reflect.hasMetadata(INJECTABLE_WATERMARK, entityInfoGetter);
    }
}
