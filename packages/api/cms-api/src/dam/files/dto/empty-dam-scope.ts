import { Field } from "@nestjs/graphql";

import { DamScopeInterface } from "../../types";
import { DamScopeType } from "../decorators/dam-scope-type.decorator";

@DamScopeType()
export class EmptyDamScope implements DamScopeInterface {
    [key: string]: unknown;
    // empty scope
    @Field({ nullable: true })
    thisScopeHasNoFields____?: string; // just anything so this class has at least one field and can be interpreted as a gql-object/input type
}
