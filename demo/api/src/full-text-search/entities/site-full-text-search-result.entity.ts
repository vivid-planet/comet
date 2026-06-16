import { ContentScope } from "@comet/cms-api";
import { Entity, FullTextType, Property } from "@mikro-orm/postgresql";
import { Field, ObjectType } from "@nestjs/graphql";

// Read-only virtual entity joining the "EntityInfoFullText" and "EntityInfo" views (created at startup by the cms-api).
// Using an `expression` instead of mapping the views directly avoids a table-name clash with the cms-api entities and
// keeps this demo resolver independent of cms-api internals.
@ObjectType()
@Entity({
    expression: `
        SELECT
            "EntityInfo"."id",
            "EntityInfo"."entityName",
            "EntityInfo"."name",
            "EntityInfo"."secondaryInformation",
            "EntityInfo"."visible",
            "EntityInfoFullText"."fullText",
            "EntityInfoFullText"."scopes"
        FROM "EntityInfoFullText"
        INNER JOIN "EntityInfo"
            ON "EntityInfo"."id" = "EntityInfoFullText"."id"
            AND "EntityInfo"."entityName" = "EntityInfoFullText"."entityName"
    `,
})
export class SiteFullTextSearchResult {
    @Field()
    @Property({ type: "text" })
    id: string;

    @Field()
    @Property({ type: "text" })
    entityName: string;

    @Field()
    @Property({ type: "text" })
    name: string;

    @Field({ nullable: true })
    @Property({ type: "text", nullable: true })
    secondaryInformation?: string;

    @Property({ type: "boolean" })
    visible: boolean;

    @Property({ type: FullTextType })
    fullText: string;

    @Property({ type: "json", nullable: true })
    scopes?: ContentScope[];
}
