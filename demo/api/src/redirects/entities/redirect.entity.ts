import { BlockDataInterface } from "@comet/blocks-api";
import { RedirectBase, RootBlockType } from "@comet/cms-api";
import { Embedded, Entity, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { RedirectsLinkBlock } from "../blocks/link.block";
import { RedirectScope } from "../dto/redirect-scope";

@Entity({ tableName: RedirectBase.tableName })
@ObjectType("Redirect") // name MUST NOT be changed in the app or gql-api in cms-api breaks
// @TODO: disguise @ObjectType("Redirect") decorator under a custom decorator: f.i. @Redirect
export class Redirect extends RedirectBase {
    @Embedded(() => RedirectScope)
    @Field(() => RedirectScope)
    scope: RedirectScope;

    @Property({ customType: new RootBlockType(RedirectsLinkBlock) })
    @Field(() => GraphQLJSONObject)
    target: BlockDataInterface;
}
