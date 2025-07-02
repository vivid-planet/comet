import { IsUndefinable, PageTreeNodeBaseCreateInput, PageTreeNodeBaseUpdateInput } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { UserGroup } from "@src/user-groups/user-group";
import { IsEnum } from "class-validator";

@InputType()
export class PageTreeNodeCreateInput extends PageTreeNodeBaseCreateInput {
    @Field(() => UserGroup, { defaultValue: UserGroup.All })
    @IsEnum(UserGroup)
    @IsUndefinable()
    userGroup?: UserGroup;
}

@InputType()
export class PageTreeNodeUpdateInput extends PageTreeNodeBaseUpdateInput {
    @Field(() => UserGroup, { defaultValue: UserGroup.All })
    @IsEnum(UserGroup)
    @IsUndefinable()
    userGroup?: UserGroup;
}
