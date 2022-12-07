import { Injectable } from "@nestjs/common";

import { DamItem, DamItemEdge, PaginatedDamItems } from "./dam-items.resolver";
import { DamItemsArgs } from "./dto/dam-items.args";
import { FilesService } from "./files.service";
import { FoldersService } from "./folders.service";

@Injectable()
export class DamItemsService {
    constructor(private readonly foldersService: FoldersService, private readonly filesService: FilesService) {}

    async findPaginated({
        folderId,
        includeArchived,
        filter,
        sortColumnName,
        sortDirection,
        first,
        after,
        last,
        before,
    }: DamItemsArgs): Promise<PaginatedDamItems> {
        const edges: DamItemEdge[] = [];

        if (first) {
        } else if (after) {
        } else {
            throw new Error("No cursor provided");
        }

        const folders = await this.foldersService.findPaginated({
            parentId: folderId,
            includeArchived,
            filter: { searchText: filter?.searchText },
            sortDirection,
            sortColumnName,
            first,
            after,
            last,
            before,
        });

        if ((first && after && folders.pageInfo.hasNextPage) || (last && before && folders.pageInfo.hasPreviousPage)) {
            // TODO: fix typing
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return folders;
        }

        const remainingFirst = first && after ? first - folders.length : undefined;
        const remainingLast = last && before ? last - folders.length : undefined;

        const files = await this.filesService.findPaginated({
            folderId,
            includeArchived,
            filter: { searchText: filter?.searchText, mimetypes: filter?.mimetypes },
            sortColumnName,
            sortDirection,
            first: remainingFirst,
            after,
            last: remainingLast,
            before,
        });

        const response: typeof DamItem[] = [...folders];

        if (remainingLimit > 0) {
            response.push(...files);
        }

        return [response, foldersTotalCount + filesTotalCount];
    }
}
