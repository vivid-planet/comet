import { ArrayType, Embeddable, Embedded, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class UserContentScopes {
    @Field()
    @PrimaryKey()
    @Property()
    userId: string;

    @Embedded(() => UserContentScope, { array: true })
    @Field(() => [UserContentScope])
    scopes: UserContentScope[] = [];
}

@Embeddable()
@ObjectType()
export class UserContentScope {
    @Property()
    @Field()
    scope: string;

    @Field(() => [String])
    @Property({ type: ArrayType })
    values: string[] = [];
}
