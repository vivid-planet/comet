import { Embeddable, Property } from "@mikro-orm/postgresql";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@Embeddable()
@ObjectType("PageTreeNodeScope") // name must not be changed in the app
@InputType("PageTreeNodeScopeInput") // name must not be changed in the app
export class PageTreeNodeScope {
    @Property({ columnType: "text" })
    @Field()
    @IsString()
    domain: string;

    @Property({ columnType: "text" })
    @Field()
    @IsString()
    language: string;
}
