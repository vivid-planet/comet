import { BlockWarning } from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NewsWarningService /*implements EntityScopeServiceInterface<DocumentInterface>*/ {
    constructor(private readonly entityManager: EntityManager) {}

    async emitWarnings(): Promise<BlockWarning[]> {
        console.log("Emitting warnings for news");
        this.entityManager.getConnection().execute("SELECT * FROM news");
        return [];
    }

    // TODO: discuss if I should also add a method that will run for every entry. The above method is intended to run custom sql queries for a specific entity.
}
