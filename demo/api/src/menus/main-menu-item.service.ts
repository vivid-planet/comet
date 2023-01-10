import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { MainMenuItem } from "@src/menus/entities/main-menu-item.entity";

@Injectable()
export class MainMenuItemService {
    constructor(@InjectRepository(MainMenuItem) private readonly mainMenuItemRepository: EntityRepository<MainMenuItem>) {}

    async findOneById(id: string): Promise<MainMenuItem> {
        return this.mainMenuItemRepository.findOneOrFail({ id });
    }
}
