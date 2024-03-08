import { Injectable } from "@nestjs/common";

import { DamScopeInterface } from "../types";
import { DamItemInterface } from "./dam-items.resolver";
import { DamItemPositionArgsInterface, DamItemsArgsInterface, DamItemType } from "./dto/dam-items.args";
import { FilesService } from "./files.service";
import { FoldersService } from "./folders.service";

@Injectable()
export class DamItemsService {
    constructor(private readonly foldersService: FoldersService, private readonly filesService: FilesService) {}

    async findAndCount(
        { folderId, filter, search, sort, offset, limit }: Omit<DamItemsArgsInterface, "scope">,
        scope?: DamScopeInterface,
    ): Promise<[DamItemInterface[], number]> {
        const [folders, foldersTotalCount] = await this.foldersService.findAndCount(
            {
                parentId: folderId,
                search,
                filter,
                sort,
                offset,
                limit,
            },
            scope,
        );

        const remainingLimit = limit - folders.length;
        const filesOffset = offset - foldersTotalCount > 0 ? offset - foldersTotalCount : 0;

        const [files, filesTotalCount] = await this.filesService.findAndCount(
            {
                folderId,
                search,
                filter,
                sort,
                offset: filesOffset,
                limit: remainingLimit,
            },
            scope,
        );

        const response: DamItemInterface[] = [...folders];

        if (remainingLimit > 0) {
            response.push(...files);
        }

        return [response, foldersTotalCount + filesTotalCount];
    }

    async getDamItemPosition({ type, id, ...args }: Omit<DamItemPositionArgsInterface, "scope">, scope?: DamScopeInterface): Promise<number> {
        if (type === DamItemType.Folder) {
            const folderPosition = await this.foldersService.getFolderPosition(
                id,
                {
                    parentId: args.folderId,
                    filter: { searchText: args.filter?.searchText },
                    sortDirection: args.sortDirection,
                    sortColumnName: args.sortColumnName,
                },
                scope,
            );

            return folderPosition;
        }

        const [, foldersTotalCount] = await this.foldersService.findAndCount(
            {
                parentId: args.folderId,
                filter: { searchText: args.filter?.searchText },
                sort: args,
                // offset and limit do not matter here
                offset: 0,
                limit: 10,
            },
            scope,
        );

        const filePosition = await this.filesService.getFilePosition(
            id,
            {
                folderId: args.folderId,
                filter: args.filter,
                sortDirection: args.sortDirection,
                sortColumnName: args.sortColumnName,
            },
            scope,
        );

        return foldersTotalCount + filePosition;
    }
}
