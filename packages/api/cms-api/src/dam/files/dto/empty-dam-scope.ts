import { Field, InputType, ObjectType } from "@nestjs/graphql";

import { DamScopeInterface } from "../../types";

@ObjectType("DamScope")
@InputType("DamScopeInput")
export class EmptyDamScope implements DamScopeInterface {
    [key: string]: unknown;
    // empty scope
    @Field({ nullable: true })
    thisScopeHasNoFields____?: string; // just anything so this class has at least one field and can be interpreted as a gql-object/input type
}
