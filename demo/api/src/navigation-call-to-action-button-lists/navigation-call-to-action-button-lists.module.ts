import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { NavigationCallToActionButtonListResolver } from "@src/navigation-call-to-action-button-lists/generated/navigation-call-to-action-button-list.resolver";
import { NavigationCallToActionButtonListsService } from "@src/navigation-call-to-action-button-lists/generated/navigation-call-to-action-button-lists.service";

import { NavigationCallToActionButtonList } from "./entities/navigation-call-to-action-button-list.entity";

@Module({
    imports: [MikroOrmModule.forFeature([NavigationCallToActionButtonList])],
    providers: [NavigationCallToActionButtonListsService, NavigationCallToActionButtonListResolver],
})
export class NavigationCallToActionButtonListsModule {}
