import { InputType, ObjectType } from "@nestjs/graphql";

function DamScopeType(): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any) {
        ObjectType("DamScope")(target);
        InputType("DamScopeInput")(target);
    };
}

export { DamScopeType };
