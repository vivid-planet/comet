import { Injectable } from "@nestjs/common";

import { DamItem } from "./dam-items.resolver";
import { DamItemsArgs } from "./dto/dam-items.args";
import { FilesService } from "./files.service";
import { FoldersService } from "./folders.service";

@Injectable()
export class DamItemsService {
    constructor(private readonly foldersService: FoldersService, private readonly filesService: FilesService) {}

    async findAndCount({
        folderId,
        includeArchived,
        filter,
        sortColumnName,
        sortDirection,
        offset,
        limit,
    }: DamItemsArgs): Promise<[typeof DamItem[], number]> {
        // const [files, totalCount] = await this.filesService.findAndCount({
        //     folderId,
        //     includeArchived,
        //     filter: { searchText: filter?.searchText, ...filter?.fileFilters },
        //     sortColumnName,
        //     sortDirection,
        //     offset,
        //     limit,
        // });

        const [folders, foldersTotalCount] = await this.foldersService.findAndCount({
            parentId: folderId,
            includeArchived,
            filter: { searchText: filter?.searchText, ...filter?.folderFilters },
            sortDirection,
            sortColumnName,
            offset,
            limit,
        });

        const remainingLimit = limit - folders.length;
        const filesOffset = offset - foldersTotalCount > 0 ? offset - foldersTotalCount : 0;

        const [files, filesTotalCount] = await this.filesService.findAndCount({
            folderId,
            includeArchived,
            filter: { searchText: filter?.searchText, ...filter?.fileFilters },
            sortColumnName,
            sortDirection,
            offset: filesOffset,
            limit: remainingLimit,
        });

        const response: typeof DamItem[] = [...folders];

        if (remainingLimit > 0) {
            response.push(...files);
        }

        return [response, foldersTotalCount + filesTotalCount];
    }
}
