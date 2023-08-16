import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, QueryBuilder } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import JSZip from "jszip";

import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { CometEntityNotFoundException } from "../../common/errors/entity-not-found.exception";
import { SortDirection } from "../../common/sorting/sort-direction.enum";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { FolderArgs } from "./dto/folder.args";
import { CreateFolderInput, UpdateFolderInput } from "./dto/folder.input";
import { Folder } from "./entities/folder.entity";
import { FilesService } from "./files.service";
import { createHashedPath } from "./files.utils";

export const withFoldersSelect = (
    qb: QueryBuilder<Folder>,
    args: {
        includeArchived?: boolean;
        parentId?: string | null;
        query?: string;
        sortColumnName?: string;
        sortDirection?: SortDirection;
        offset?: number;
        limit?: number;
    },
): QueryBuilder<Folder> => {
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

const addSearchTermFiltertoQueryBuilder = (qb: QueryBuilder<Folder>, searchText: string): QueryBuilder<Folder> => {
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
        @InjectRepository(Folder) private readonly foldersRepository: EntityRepository<Folder>,
        @Inject(forwardRef(() => FilesService)) private readonly filesService: FilesService,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
        @Inject(DAM_CONFIG) private readonly config: DamConfig,
    ) {}

    async findAll({ parentId, includeArchived, filter, sortColumnName, sortDirection }: Omit<FolderArgs, "offset" | "limit">): Promise<Folder[]> {
        const qb = withFoldersSelect(this.selectQueryBuilder(), {
            includeArchived,
            parentId,
            query: filter?.searchText,
            sortColumnName,
            sortDirection,
        });

        return qb.getResult();
    }

    async findAndCount({ parentId, includeArchived, filter, sortColumnName, sortDirection, offset, limit }: FolderArgs): Promise<[Folder[], number]> {
        const args = {
            includeArchived,
            parentId,
            query: filter?.searchText,
            sortColumnName,
            sortDirection,
            offset,
            limit,
        };

        const qb = withFoldersSelect(this.selectQueryBuilder(), args);
        const folders = await qb.getResult();

        const countQb = withFoldersSelect(this.countQueryBuilder(), args);
        const totalCount = await countQb.getCount();

        return [folders, totalCount];
    }

    async findAllByIds(ids: string[]): Promise<Folder[]> {
        return this.selectQueryBuilder()
            .where({ id: { $in: ids } })
            .getResult();
    }

    async findOneById(id: string): Promise<Folder | null> {
        const qb = this.selectQueryBuilder().where({ id });

        return qb.getSingleResult();
    }

    async findOneByNameAndParentId(name: string, parentId?: string): Promise<Folder | null> {
        const qb = this.selectQueryBuilder().andWhere({ name });
        if (parentId) {
            qb.andWhere({ parent: { id: parentId } });
        } else {
            qb.andWhere({ parent: { id: null } });
        }
        return qb.getSingleResult();
    }

    async create({ parentId, ...data }: CreateFolderInput): Promise<Folder> {
        let parent = undefined;
        let mpath: string[] = [];
        if (parentId) {
            parent = await this.findOneById(parentId);
            mpath = (await this.findAncestorsByParentId(parentId)).map((folder) => folder.id);
        }
        const folder = this.foldersRepository.create({ ...data, parent, mpath });
        await this.foldersRepository.persistAndFlush(folder);
        return folder;
    }

    async updateById(id: string, data: UpdateFolderInput): Promise<Folder> {
        const folder = await this.findOneById(id);
        if (!folder) throw new CometEntityNotFoundException();
        return this.updateByEntity(folder, data);
    }

    async updateByEntity(entity: Folder, { parentId, ...input }: UpdateFolderInput): Promise<Folder> {
        const parentIsDirty = parentId !== undefined && entity.parent?.id !== parentId;
        const parent = parentId ? await this.findOneById(parentId) : null;

        const folder = entity.assign({
            ...input,
            parent: parentId !== undefined ? parent : entity.parent,
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

    async moveBatch(folderIds: string[], targetFolderId?: string): Promise<Folder[]> {
        const folders = [];

        for (const id of folderIds) {
            const folder = await this.updateById(id, { parentId: targetFolderId });
            folders.push(folder);
        }

        return folders;
    }

    async delete(id: string): Promise<boolean> {
        const files = await this.filesService.findAll({ folderId: id });
        for (const file of files) {
            await this.filesService.delete(file.id);
        }

        const subFolders = await this.findAll({ parentId: id });
        for (const subFolder of subFolders) {
            await this.delete(subFolder.id);
        }

        const result = await this.foldersRepository.nativeDelete(id);
        return result === 1;
    }

    async findAncestorsByParentId(parentId: string | null): Promise<Folder[]> {
        const parents: Folder[] = [];
        while (parentId !== null) {
            const folder = (await this.findOneById(parentId)) as Folder;
            parents.push(folder);
            parentId = folder.parent?.id ?? null;
        }
        return parents.reverse();
    }

    async findAncestorsByMaterializedPath(mpath: string[]): Promise<Folder[]> {
        const folders = await this.selectQueryBuilder()
            .where({ id: { $in: mpath } })
            .getResult();
        return mpath.map((id) => folders.find((folder) => folder.id === id) as Folder);
    }

    async createZipStreamFromFolder(folderId: string): Promise<NodeJS.ReadableStream> {
        const zip = new JSZip();

        await this.addFolderToZip(folderId, zip);

        return zip.generateNodeStream({ streamFiles: true });
    }

    private async addFolderToZip(folderId: string, zip: JSZip): Promise<void> {
        const files = await this.filesService.findAll({ folderId: folderId });
        const subfolders = await this.findAll({ parentId: folderId });

        for (const file of files) {
            const fileStream = await this.blobStorageBackendService.getFile(this.config.filesDirectory, createHashedPath(file.contentHash));

            zip.file(file.name, fileStream);
        }
        const countedSubfolderNames: Record<string, number> = {};

        for (const subfolder of subfolders) {
            const subfolderName = subfolder.name;
            const updatedSubfolderName = this.getUniqueFolderName(subfolderName, countedSubfolderNames);

            const subfolderZip = zip.folder(updatedSubfolderName);
            if (!subfolderZip) {
                continue;
            } // TODO: throw error if there is an actual possibility that subfolderZip is null
            await this.addFolderToZip(subfolder.id, subfolderZip);
        }
    }

    private getUniqueFolderName(folderName: string, countedFolderNames: Record<string, number>) {
        if (!countedFolderNames[folderName]) {
            countedFolderNames[folderName] = 1;
        } else {
            countedFolderNames[folderName]++;
        }

        const duplicateCount = countedFolderNames[folderName];

        let updatedFolderName = folderName;
        if (duplicateCount > 1) {
            updatedFolderName = `${folderName} ${duplicateCount}`;
        }
        return updatedFolderName;
    }

    private selectQueryBuilder(): QueryBuilder<Folder> {
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

    private countQueryBuilder(): QueryBuilder<Folder> {
        return this.foldersRepository.createQueryBuilder("folder").select("*");
    }
}
