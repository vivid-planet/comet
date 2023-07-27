import { MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, QueryBuilder } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import isEqual from "lodash.isequal";

import { CometEntityNotFoundException } from "../../common/errors/entity-not-found.exception";
import { SortDirection } from "../../common/sorting/sort-direction.enum";
import { DamScopeInterface } from "../types";
import { DamFolderListPositionArgs, FolderArgsInterface } from "./dto/folder.args";
import { CreateFolderInput, UpdateFolderInput } from "./dto/folder.input";
import { FOLDER_TABLE_NAME, FolderInterface } from "./entities/folder.entity";
import { FilesService } from "./files.service";

export const withFoldersSelect = (
    qb: QueryBuilder<FolderInterface>,
    args: {
        includeArchived?: boolean;
        parentId?: string | null;
        query?: string;
        sortColumnName?: string;
        sortDirection?: SortDirection;
        offset?: number;
        limit?: number;
        scope?: DamScopeInterface;
    },
): QueryBuilder<FolderInterface> => {
    if (!args.includeArchived) {
        qb.where({ archived: false });
    }

    const isSearching = args.query !== undefined && args.query.length > 0;
    if (!isSearching) {
        if (args.parentId !== undefined) {
            qb.where({ parent: { id: args.parentId } });
        } else {
            qb.where({ parent: { id: null } });
        }
    }

    if (args.scope !== undefined) {
        qb.andWhere({ scope: args.scope });
    }

    if (args.query) {
        qb = addSearchTermFiltertoQueryBuilder(qb, args.query);
    }

    if (args.sortColumnName && args.sortDirection) {
        qb.orderBy({ [`folder.${args.sortColumnName}`]: args.sortDirection });
    }

    if (args.offset) {
        qb.offset(args.offset);
    }
    if (args.limit) {
        qb.limit(args.limit);
    }

    return qb;
};

const addSearchTermFiltertoQueryBuilder = (qb: QueryBuilder<FolderInterface>, searchText: string): QueryBuilder<FolderInterface> => {
    const terms = searchText.split(" ");
    for (const term of terms) {
        qb.andWhere({ name: { $ilike: `%${term}%` } });
    }
    return qb;
};

@Injectable()
export class FoldersService {
    protected readonly logger = new Logger(FoldersService.name);

    constructor(
        @InjectRepository("Folder") private readonly foldersRepository: EntityRepository<FolderInterface>,
        @Inject(forwardRef(() => FilesService)) private readonly filesService: FilesService,
        private readonly orm: MikroORM,
    ) {}

    async findAllByParentId(
        { parentId, includeArchived, filter, sortColumnName, sortDirection }: Omit<FolderArgsInterface, "offset" | "limit" | "scope">,
        scope?: DamScopeInterface,
    ): Promise<FolderInterface[]> {
        const qb = withFoldersSelect(this.selectQueryBuilder(), {
            includeArchived,
            parentId,
            query: filter?.searchText,
            sortColumnName,
            sortDirection,
            scope,
        });

        return qb.getResult();
    }

    async findAllFlat(scope?: DamScopeInterface): Promise<FolderInterface[]> {
        const qb = this.selectQueryBuilder().orderBy({ name: "ASC" });

        if (scope) {
            qb.where({ scope });
        }

        return qb.getResult();
    }

    async findAndCount(
        { parentId, includeArchived, filter, sortColumnName, sortDirection, offset, limit }: Omit<FolderArgsInterface, "scope">,
        scope?: DamScopeInterface,
    ): Promise<[FolderInterface[], number]> {
        const args = {
            includeArchived,
            parentId,
            query: filter?.searchText,
            sortColumnName,
            sortDirection,
            offset,
            limit,
            scope,
        };

        const qb = withFoldersSelect(this.selectQueryBuilder(), args);
        const folders = await qb.getResult();

        const countQb = withFoldersSelect(this.countQueryBuilder(), args);
        const totalCount = await countQb.getCount();

        return [folders, totalCount];
    }

    async findAllByIds(ids: string[]): Promise<FolderInterface[]> {
        return this.selectQueryBuilder()
            .where({ id: { $in: ids } })
            .getResult();
    }

    async findOneById(id: string): Promise<FolderInterface | null> {
        const qb = this.selectQueryBuilder().where({ id });

        return qb.getSingleResult();
    }

    async findOneByNameAndParentId(
        { name, parentId }: { name: string; parentId?: string },
        scope?: DamScopeInterface,
    ): Promise<FolderInterface | null> {
        const qb = this.selectQueryBuilder().andWhere({ name, scope });
        if (parentId) {
            qb.andWhere({ parent: { id: parentId } });
        } else {
            qb.andWhere({ parent: { id: null } });
        }
        return qb.getSingleResult();
    }

    async create(
        { parentId, isInboxFromOtherScope = false, ...data }: CreateFolderInput & { isInboxFromOtherScope?: boolean },
        scope?: DamScopeInterface,
    ): Promise<FolderInterface> {
        let parent = undefined;
        let mpath: string[] = [];
        if (parentId) {
            parent = await this.findOneById(parentId);
            mpath = (await this.findAncestorsByParentId(parentId)).map((folder) => folder.id);
        }
        const folder = this.foldersRepository.create({ ...data, isInboxFromOtherScope, parent, mpath, scope });
        await this.foldersRepository.persistAndFlush(folder);
        return folder;
    }

    async updateById(id: string, data: UpdateFolderInput): Promise<FolderInterface> {
        const folder = await this.findOneById(id);
        if (!folder) throw new CometEntityNotFoundException();
        return this.updateByEntity(folder, data);
    }

    async updateByEntity(entity: FolderInterface, { parentId, ...input }: UpdateFolderInput): Promise<FolderInterface> {
        if (!(await this.isValidParentForFolder(entity.id, parentId ?? null))) {
            throw new Error("Cannot make a folder its own child.");
        }

        const parentIsDirty = parentId !== undefined && entity.parent?.id !== parentId;
        const parent = parentId ? await this.findOneById(parentId) : null;

        const folder = entity.assign({
            ...input,
            parent: parentId !== undefined ? parent : entity.parent,
            // if the user changes the folder name, it's treated as a normal folder now (isInboxFromOtherScope = false)
            isInboxFromOtherScope: entity.name === input.name ? entity.isInboxFromOtherScope : false,
        });

        if (parentIsDirty) {
            folder.mpath = folder.parent ? (await this.findAncestorsByParentId(folder.parent.id)).map((f) => f.id) : [];

            const qb = this.foldersRepository.createQueryBuilder();
            await qb
                .update({
                    mpath: qb.raw("array_cat(ARRAY[?]::uuid[], mpath[(array_position(mpath, ?)):array_length(mpath,1)])", [folder.mpath, folder.id]),
                })
                .where("? = ANY(mpath)", [folder.id])
                .execute();
        }

        await this.foldersRepository.persistAndFlush(folder);
        return folder;
    }

    async moveBatch(
        {
            folderIds,
            targetFolderId,
        }: {
            folderIds: string[];
            targetFolderId?: string;
        },
        scope?: DamScopeInterface,
    ): Promise<FolderInterface[]> {
        let isValidParentId = true;
        for (const folderId of folderIds) {
            if (!(await this.isValidParentForFolder(folderId, targetFolderId ?? null))) {
                isValidParentId = false;
            }
        }

        if (!isValidParentId) {
            throw new Error("Cannot make a folder its own child.");
        }

        const folders = [];

        if (targetFolderId) {
            const targetFolder = await this.findOneById(targetFolderId);

            if (!targetFolder) {
                throw new Error("Target folder doesn't exist");
            }

            // Convert to JS object because deep-comparing classes and objects doesn't work
            if (scope && targetFolder.scope && !isEqual({ ...targetFolder.scope }, scope)) {
                throw new Error("Scope arg doesn't match folder scope");
            }
        }

        for (const id of folderIds) {
            let folder = await this.findOneById(id);

            if (!folder) {
                throw new Error("Folder doesn't exist");
            }

            // Convert to JS object because deep-comparing classes and objects doesn't work
            if (scope && folder.scope && !isEqual({ ...folder.scope }, scope)) {
                throw new Error("Scope arg doesn't match folder scope");
            }

            folder = await this.updateByEntity(folder, { parentId: targetFolderId });
            folders.push(folder);
        }

        return folders;
    }

    async delete(id: string): Promise<boolean> {
        const files = await this.filesService.findAll({ folderId: id });
        for (const file of files) {
            await this.filesService.delete(file.id);
        }

        const subFolders = await this.findAllByParentId({ parentId: id });
        for (const subFolder of subFolders) {
            await this.delete(subFolder.id);
        }

        const result = await this.foldersRepository.nativeDelete(id);
        return result === 1;
    }

    async getFolderPosition(folderId: string, args: Omit<DamFolderListPositionArgs, "scope">, scope?: DamScopeInterface): Promise<number> {
        const subQb = withFoldersSelect(
            this.foldersRepository
                .createQueryBuilder("folder")
                .select(`folder.id, ROW_NUMBER() OVER( ORDER BY folder."${args.sortColumnName}" ${args.sortDirection} ) AS row_number`),
            {
                includeArchived: args.includeArchived,
                parentId: args.parentId,
                query: args.filter?.searchText,
                sortColumnName: args.sortColumnName,
                sortDirection: args.sortDirection,
                scope,
            },
        );

        const result: { rows: Array<{ row_number: string }> } = await this.foldersRepository.createQueryBuilder().raw(
            `select "folder_with_row_number".row_number
                from "${FOLDER_TABLE_NAME}" as "folder"
                join (${subQb.getFormattedQuery()}) as "folder_with_row_number" ON folder_with_row_number.id = folder.id
                where "folder"."id" = ?
            `,
            [folderId],
        );

        if (result.rows.length === 0) {
            throw new Error("Folder ID does not exist.");
        }

        // make the positions start with 0
        return Number(result.rows[0].row_number) - 1;
    }

    async isValidParentForFolder(folderId: string, parentId: string | null): Promise<boolean> {
        const ancestors = await this.findAncestorsByParentId(parentId);
        const ancestorIds = ancestors.map((ancestor) => ancestor.id);

        return !ancestorIds.includes(folderId);
    }

    async findAncestorsByParentId(parentId: string | null): Promise<FolderInterface[]> {
        const parents: FolderInterface[] = [];
        while (parentId !== null) {
            const folder = (await this.findOneById(parentId)) as FolderInterface;
            parents.push(folder);
            parentId = folder.parent?.id ?? null;
        }
        return parents.reverse();
    }

    async findAncestorsByMaterializedPath(mpath: string[]): Promise<FolderInterface[]> {
        const folders = await this.selectQueryBuilder()
            .where({ id: { $in: mpath } })
            .getResult();
        return mpath.map((id) => folders.find((folder) => folder.id === id) as FolderInterface);
    }

    private selectQueryBuilder(): QueryBuilder<FolderInterface> {
        return this.foldersRepository
            .createQueryBuilder("folder")
            .select("*")
            .leftJoinAndSelect("folder.parent", "parent")
            .addSelect('COUNT(DISTINCT children.id) as "numberOfChildFolders"')
            .leftJoin("folder.children", "children")
            .addSelect('COUNT(DISTINCT files.id) as "numberOfFiles"')
            .leftJoin("folder.files", "files")
            .groupBy(["folder.id", "parent.id"]);
    }

    private countQueryBuilder(): QueryBuilder<FolderInterface> {
        return this.foldersRepository.createQueryBuilder("folder").select("*");
    }
}
