import { faker } from "@faker-js/faker";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { NavigationCallToActionButtonListContentBlock } from "@src/navigation-call-to-action-button-lists/blocks/navigation-call-to-action-button-list-content.block";
import { NavigationCallToActionButtonListScope } from "@src/navigation-call-to-action-button-lists/dto/navigation-call-to-action-button-list-scope";
import { NavigationCallToActionButtonList } from "@src/navigation-call-to-action-button-lists/entities/navigation-call-to-action-button-list.entity";

import { CallToActionBlockFixtureService } from "./blocks/navigation/call-to-action-block-fixture.service";

@Injectable()
export class NavigationCallToActionButtonListFixtureService {
    constructor(
        private readonly callToActionBlockFixtureService: CallToActionBlockFixtureService,
        private readonly entityManager: EntityManager,
    ) {}

    async generateNavigationCallToActionButtonList(scope: NavigationCallToActionButtonListScope): Promise<NavigationCallToActionButtonList> {
        const blocks = [];

        for (let i = 0; i < 2; i++) {
            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                props: await this.callToActionBlockFixtureService.generateBlockInput(),
            });
        }

        const entity = new NavigationCallToActionButtonList();
        entity.content = NavigationCallToActionButtonListContentBlock.blockInputFactory({
            blocks,
        }).transformToBlockData();
        entity.scope = scope;

        await this.entityManager.persistAndFlush(entity);

        return entity;
    }
}
