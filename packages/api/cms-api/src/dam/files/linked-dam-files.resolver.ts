import { Type } from "@nestjs/common";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { DamScopeInterface } from "../types";
import { FileInterface } from "./entities/file.entity";
import { LinkedDamFile } from "./entities/linked-dam-file.entity";

export function createLinkedDamFilesResolver({
    File,
    Scope: PassedScope,
}: {
    File: Type<FileInterface>;
    Scope?: Type<DamScopeInterface>;
}): Type<unknown> {
    const hasNonEmptyScope = PassedScope != null;

    @RequiredPermission(["dam"], { skipScopeCheck: !hasNonEmptyScope })
    @Resolver(() => LinkedDamFile)
    class LinkedDamFilesResolver {
        @ResolveField(() => File)
        async source(@Parent() linkedDamFile: LinkedDamFile): Promise<FileInterface> {
            return linkedDamFile.source.load();
        }

        @ResolveField(() => File)
        async target(@Parent() linkedDamFile: LinkedDamFile): Promise<FileInterface> {
            return linkedDamFile.target.load();
        }
    }

    return LinkedDamFilesResolver;
}
