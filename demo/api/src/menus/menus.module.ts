import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { MainMenuItemService } from "@src/menus/main-menu-item.service";
import { PagesModule } from "@src/pages/pages.module";

import { MainMenuItem } from "./entities/main-menu-item.entity";
import { MainMenuItemResolver } from "./main-menu-item.resolver";
import { MenusResolver } from "./menus.resolver";

@Module({
    imports: [PagesModule, MikroOrmModule.forFeature([MainMenuItem])],
    providers: [MenusResolver, MainMenuItemResolver, MainMenuItemService],
})
export class MenusModule {}
