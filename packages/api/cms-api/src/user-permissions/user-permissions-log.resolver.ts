import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Args, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { OffsetBasedPaginationArgs } from "../common/pagination/offset-based.args";
import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { LogUserPermissionArgs } from "./dto/log-user-permission.args";
import { LogUser } from "./entities/log-user.entity";
import { LogUserPermission } from "./entities/log-user-permission.entity";

@ObjectType()
export class PaginatedUserLog extends PaginatedResponseFactory.create(LogUser) {}

@ObjectType()
export class PaginatedPermissionLog extends PaginatedResponseFactory.create(LogUserPermission) {}

@Resolver()
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserPermissionsLogResolver {
    constructor(
        @InjectRepository(LogUser) private readonly logUserRepository: EntityRepository<LogUser>,
        @InjectRepository(LogUserPermission) private readonly logPermissionRepository: EntityRepository<LogUserPermission>,
    ) {}

    @Query(() => PaginatedUserLog)
    async userPermissionsLogUserList(@Args() { offset, limit }: OffsetBasedPaginationArgs): Promise<PaginatedUserLog> {
        const totalCount = await this.logUserRepository.count();
        const entities = await this.logUserRepository.find(
            {},
            {
                orderBy: { lastseen: "desc" },
                offset,
                limit,
            },
        );
        return new PaginatedUserLog(entities, totalCount);
    }

    @Query(() => PaginatedPermissionLog)
    async userPermissionsLogPermissionsList(@Args() { userId, offset, limit }: LogUserPermissionArgs): Promise<PaginatedPermissionLog> {
        const totalCount = await this.logPermissionRepository.count({ userId });
        const entities = await this.logPermissionRepository.find(
            { userId },
            {
                orderBy: { lastUsedAt: "desc" },
                offset,
                limit,
            },
        );
        return new PaginatedPermissionLog(entities, totalCount);
    }
}
