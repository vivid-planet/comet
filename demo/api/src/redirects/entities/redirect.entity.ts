import { BlockDataInterface } from "@comet/blocks-api";
import { CrudGenerator, RedirectBaseEntity, RootBlockType } from "@comet/cms-api";
import { Embedded, Entity, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { NewsLinkBlock } from "@src/news/blocks/news-link.block";
import { GraphQLJSONObject } from "graphql-type-json";

import { RedirectScope } from "../dto/redirect-scope";

@Entity({})
@ObjectType("Redirect") // name MUST NOT be changed in the app or gql-api in cms-api breaks
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Redirect extends RedirectBaseEntity {
    @Embedded(() => RedirectScope)
    @Field(() => RedirectScope)
    scope: RedirectScope;

    @Property({ customType: new RootBlockType(NewsLinkBlock) })
    @Field(() => GraphQLJSONObject)
    target: BlockDataInterface;
}
/*
TODO:

redirect ist gar kein module mehr in library, nur mehr kleiner helper

- redirectSourceAvailable (custom resolver): in library: factory(?), redirect/redirect-source-available.resolver
    -> PROBLEM: braucht scope (wenns einen gibt)
          -> idee: 2 resolver, einen mit scope einen ohne und die applikation wählt dein richtigen (kann auch eine factory sein die beide mit if beinhaltet)

- service mit createAutomaticRedirects: in library: redirect/auto-creator.service

generator features:
- enum (sourceType) in input (+filter+sort)
- custom validator: IsValidRedirectSource
- Activeness (wie visible)

*/
