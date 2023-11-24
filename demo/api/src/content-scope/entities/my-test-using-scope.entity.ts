import { CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Embedded, Entity, PrimaryKey } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { ContentScopeOnEntiy } from "./my-scope.entity";

@ObjectType()
@Entity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` /* create: false, update: false, delete: false*/ })
export class MyTestEntityUsingScope extends BaseEntity<MyTestEntityUsingScope, "id"> {
    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Embedded(() => ContentScopeOnEntiy)
    @Field(() => ContentScopeOnEntiy)
    scope: ContentScopeOnEntiy;
}
