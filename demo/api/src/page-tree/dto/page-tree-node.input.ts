import { PageTreeNodeBaseCreateInput, PageTreeNodeBaseUpdateInput } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { PageTreeNodeUserGroup } from "@src/page-tree/page-tree-node-user-group";
import { IsEnum, IsOptional } from "class-validator";

@InputType()
export class PageTreeNodeCreateInput extends PageTreeNodeBaseCreateInput {
    @Field(() => PageTreeNodeUserGroup, { defaultValue: PageTreeNodeUserGroup.All })
    @IsEnum(PageTreeNodeUserGroup)
    @IsOptional()
    userGroup?: PageTreeNodeUserGroup;
}

@InputType()
export class PageTreeNodeUpdateInput extends PageTreeNodeBaseUpdateInput {
    @Field(() => PageTreeNodeUserGroup, { defaultValue: PageTreeNodeUserGroup.All })
    @IsEnum(PageTreeNodeUserGroup)
    @IsOptional()
    userGroup?: PageTreeNodeUserGroup;
}
