import { Injectable } from "@nestjs/common";

import { DamItemInterface } from "./dam-items.resolver";
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
    }: DamItemsArgs): Promise<[DamItemInterface[], number]> {
        const [folders, foldersTotalCount] = await this.foldersService.findAndCount({
            parentId: folderId,
            includeArchived,
            filter: { searchText: filter?.searchText },
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
            filter: { searchText: filter?.searchText, mimetypes: filter?.mimetypes },
            sortColumnName,
            sortDirection,
            offset: filesOffset,
            limit: remainingLimit,
        });

        const response: DamItemInterface[] = [...folders];

        if (remainingLimit > 0) {
            response.push(...files);
        }

        return [response, foldersTotalCount + filesTotalCount];
    }
}
