import { MikroORM, Utils } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, QueryBuilder } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { createHmac } from "crypto";
import exifr from "exifr";
import { createReadStream } from "fs";
import getColors from "get-image-colors";
import * as hasha from "hasha";
import fetch from "node-fetch";
import { basename, extname, parse } from "path";
import probe from "probe-image-size";
import * as rimraf from "rimraf";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { CometEntityNotFoundException } from "../../common/errors/entity-not-found.exception";
import { SortDirection } from "../../common/sorting/sort-direction.enum";
import { ContentScopeService } from "../../user-permissions/content-scope.service";
import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../../user-permissions/user-permissions.types";
import { FocalPoint } from "../common/enums/focal-point.enum";
import { CometImageResolutionException } from "../common/errors/image-resolution.exception";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG, IMGPROXY_CONFIG } from "../dam.constants";
import { ImageCropAreaInput } from "../images/dto/image-crop-area.input";
import { Extension, ResizingType } from "../imgproxy/imgproxy.enum";
import { ImgproxyConfig, ImgproxyService } from "../imgproxy/imgproxy.service";
import { DamScopeInterface } from "../types";
import { DamFileListPositionArgs, FileArgsInterface } from "./dto/file.args";
import { UploadFileBodyInterface } from "./dto/file.body";
import { CreateFileInput, ImageFileInput, UpdateFileInput } from "./dto/file.input";
import { FileParams } from "./dto/file.params";
import { FileUploadInterface } from "./dto/file-upload.interface";
import { FILE_TABLE_NAME, FileInterface } from "./entities/file.entity";
import { DamFileImage } from "./entities/file-image.entity";
import { FolderInterface } from "./entities/folder.entity";
import { createHashedPath, slugifyFilename } from "./files.utils";
import { FoldersService } from "./folders.service";

const exifrSupportedMimetypes = ["image/jpeg", "image/tiff", "image/x-iiq", "image/heif", "image/heic", "image/avif", "image/png"];

export const withFilesSelect = (
    qb: QueryBuilder<FileInterface>,
    args: {
        query?: string;
        id?: string;
        copyOfId?: string;
        filename?: string;
        folderId?: string | null;
        imageId?: string;
        contentHash?: string;
        archived?: boolean;
        mimetypes?: string[];
        sortColumnName?: string;
        sortDirection?: SortDirection;
        offset?: number;
        limit?: number;
        scope?: DamScopeInterface;
        imageCropArea?: ImageCropAreaInput;
    },
): QueryBuilder<FileInterface> => {
    if (args.query) {
        qb.andWhere("file.name ILIKE ANY (ARRAY[?])", [args.query.split(" ").map((term) => `%${term}%`)]);
    }
    if (args.id) qb.andWhere({ id: args.id });
    if (args.copyOfId) qb.andWhere({ copyOf: { id: args.copyOfId } });
    if (args.filename) qb.andWhere({ name: args.filename });
    if (args.contentHash) qb.andWhere({ contentHash: args.contentHash });
    if (args.archived !== undefined) qb.andWhere({ archived: args.archived });
    if (args.folderId !== undefined) {
        if (args.folderId) {
            qb.andWhere({ folder: { id: args.folderId } });
        } else {
            qb.andWhere({ folder: { id: null } });
        }
    }
    if (args.scope !== undefined) {
        qb.andWhere({ scope: args.scope });
    }
    if (args.mimetypes !== undefined) {
        qb.andWhere({ mimetype: { $in: args.mimetypes } });
    }

    if (args.imageId) qb.andWhere({ image: { id: args.imageId } });
    if (args.imageCropArea) {
        qb.andWhere({ image: { cropArea: args.imageCropArea } });
    }

    if (args.sortColumnName && args.sortDirection) {
        qb.orderBy({ [`file.${args.sortColumnName}`]: args.sortDirection });
    }

    if (args.offset) {
        qb.offset(args.offset);
    }
    if (args.limit) {
        qb.limit(args.limit);
    }

    return qb;
};

@Injectable()
export class FilesService {
    protected readonly logger = new Logger(FilesService.name);
    static readonly UPLOAD_FIELD = "file";

    constructor(
        @InjectRepository("DamFile") private readonly filesRepository: EntityRepository<FileInterface>,
        @InjectRepository(DamFileImage) private readonly fileImagesRepository: EntityRepository<DamFileImage>,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
        private readonly foldersService: FoldersService,
        @Inject(IMGPROXY_CONFIG) private readonly imgproxyConfig: ImgproxyConfig,
        @Inject(DAM_CONFIG) private readonly config: DamConfig,
        private readonly imgproxyService: ImgproxyService,
        private readonly orm: MikroORM,
        private readonly contentScopeService: ContentScopeService,
        @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
    ) {}

    private selectQueryBuilder(): QueryBuilder<FileInterface> {
        return this.filesRepository
            .createQueryBuilder("file")
            .select("*")
            .leftJoinAndSelect("file.image", "image")
            .leftJoinAndSelect("file.folder", "folder");
    }

    async findAll(
        { folderId, includeArchived, filter, sortColumnName, sortDirection }: Omit<FileArgsInterface, "offset" | "limit" | "scope">,
        scope?: DamScopeInterface,
    ): Promise<FileInterface[]> {
        const isSearching = filter?.searchText !== undefined && filter.searchText.length > 0;

        return withFilesSelect(this.selectQueryBuilder(), {
            archived: !includeArchived ? false : undefined,
            folderId: !isSearching ? folderId || null : undefined,
            mimetypes: filter?.mimetypes,
            query: filter?.searchText,
            sortColumnName,
            sortDirection,
            scope,
        }).getResult();
    }

    async findAndCount(
        { folderId, includeArchived, filter, sortColumnName, sortDirection, offset, limit }: Omit<FileArgsInterface, "scope">,
        scope?: DamScopeInterface,
    ): Promise<[FileInterface[], number]> {
        const isSearching = filter?.searchText !== undefined && filter.searchText.length > 0;

        const files = await withFilesSelect(this.selectQueryBuilder(), {
            archived: !includeArchived ? false : undefined,
            folderId: !isSearching ? folderId || null : undefined,
            mimetypes: filter?.mimetypes,
            query: filter?.searchText,
            sortColumnName,
            sortDirection,
            offset,
            limit,
            scope,
        }).getResult();

        const totalCount = await withFilesSelect(this.selectQueryBuilder(), {
            archived: !includeArchived ? false : undefined,
            folderId: !isSearching ? folderId || null : undefined,
            mimetypes: filter?.mimetypes,
            query: filter?.searchText,
            sortColumnName,
            sortDirection,
            offset,
            limit,
            scope,
        }).getCount();

        return [files, totalCount];
    }

    async findAllByHash(contentHash: string): Promise<FileInterface[]> {
        return withFilesSelect(this.selectQueryBuilder(), { contentHash }).getResult();
    }

    async findMultipleByIds(ids: string[]) {
        return withFilesSelect(this.selectQueryBuilder(), {})
            .where({ id: { $in: ids } })
            .getResult();
    }

    async findCopiesOfFileInScope(fileId: string, imageCropArea?: ImageCropAreaInput, scope?: DamScopeInterface) {
        return withFilesSelect(this.selectQueryBuilder(), { copyOfId: fileId, imageCropArea, scope }).getResult();
    }

    async findOneById(id: string): Promise<FileInterface | null> {
        return withFilesSelect(this.selectQueryBuilder(), { id }).getSingleResult();
    }

    async getDamPath(file: FileInterface): Promise<string> {
        const folderNames = file.folder ? (await this.foldersService.findAncestorsByParentId(file.folder.id)).map((folder) => folder.name) : [];
        return `/${folderNames.join("/")}`;
    }

    async findOneByHash(contentHash: string): Promise<FileInterface | null> {
        return withFilesSelect(this.selectQueryBuilder(), { contentHash }).getSingleResult();
    }

    async calculateHashForFile(filePath: string): Promise<string> {
        return hasha.fromFile(filePath, { algorithm: "md5" });
    }

    async findOneByFilenameAndFolder(
        {
            filename,
            folderId = null,
        }: {
            filename: string;
            folderId?: string | null;
        },
        scope?: DamScopeInterface,
    ): Promise<FileInterface | null> {
        return withFilesSelect(this.selectQueryBuilder(), { folderId, filename, scope }).getSingleResult();
    }

    async findOneByImageId(imageId: string): Promise<FileInterface | null> {
        return withFilesSelect(this.selectQueryBuilder(), { imageId }).getSingleResult();
    }

    async create({ folderId, ...data }: CreateFileInput & { copyOf?: FileInterface }): Promise<FileInterface> {
        const folder = folderId ? await this.foldersService.findOneById(folderId) : undefined;
        return this.save(this.filesRepository.create({ ...data, license: { ...data.license }, folder: folder?.id }));
    }

    async updateById(id: string, data: UpdateFileInput): Promise<FileInterface> {
        const file = await this.findOneById(id);
        if (!file) throw new CometEntityNotFoundException();
        return this.updateByEntity(file, data);
    }

    async updateByEntity(entity: FileInterface, { folderId, image, ...input }: UpdateFileInput): Promise<FileInterface> {
        const folder = folderId ? await this.foldersService.findOneById(folderId) : null;

        if (entity.image && image?.cropArea) {
            entity.image.cropArea = image.cropArea;
        }

        const entityWithSameName = await this.findOneByFilenameAndFolder({ filename: entity.name, folderId }, entity.scope);

        if (entityWithSameName !== null && entityWithSameName.id !== entity.id) {
            throw new Error(`Entity with name '${entity.name}' already exists in ${folder ? `folder '${folder.name}'` : "root folder"}`);
        }

        const file = Object.assign(entity, {
            ...input,
            folder: folderId !== undefined ? folder : entity.folder,
        });
        return this.save(file);
    }

    async moveBatch(files: FileInterface[], targetFolder: FolderInterface | null): Promise<FileInterface[]> {
        const updatedFiles = [];

        for (const file of files) {
            // Convert to JS object because deep-comparing classes and objects doesn't work
            if (targetFolder?.scope !== undefined && !this.contentScopeService.scopesAreEqual(file.scope, targetFolder.scope)) {
                throw new Error("Target folder scope doesn't match file scope");
            }

            updatedFiles.push(await this.updateByEntity(file, { folderId: targetFolder?.id ?? null }));
        }

        return updatedFiles;
    }

    async delete(id: string): Promise<boolean> {
        const file = await this.findOneById(id);
        if (!file) throw new CometEntityNotFoundException();

        const result = await this.filesRepository.nativeDelete(id);
        const deleted = result === 1;

        if (
            deleted &&
            (await withFilesSelect(this.filesRepository.createQueryBuilder("file"), { contentHash: file.contentHash }).getResult()).length === 0
        ) {
            await this.blobStorageBackendService.removeFile(this.config.filesDirectory, createHashedPath(file.contentHash));
        }

        return deleted;
    }

    async save(entity: FileInterface): Promise<FileInterface> {
        await this.filesRepository.persistAndFlush(entity);
        return entity;
    }

    async upload(
        file: FileUploadInterface,
        { folderId, scope, ...assignData }: Omit<UploadFileBodyInterface, "scope"> & { scope?: DamScopeInterface },
    ): Promise<FileInterface> {
        let result: FileInterface | undefined = undefined;
        try {
            const contentHash = await this.calculateHashForFile(file.path);
            let image: probe.ProbeResult | undefined;
            try {
                image = await probe(createReadStream(file.path));
                if (image.type == "svg") image = undefined;
                if (image !== undefined && image.orientation !== undefined && [6, 8].includes(image.orientation)) {
                    image = {
                        ...image,
                        width: image.height,
                        height: image.width,
                    };
                }
            } catch (e) {
                // empty
            }

            if (
                image !== undefined &&
                image.width &&
                image.height &&
                Math.round(((image.width * image.height) / 1000000) * 10) / 10 >= this.imgproxyConfig.maxSrcResolution
            ) {
                throw new CometImageResolutionException(`Maximal image resolution exceeded`);
            }

            if (folderId) {
                const folder = await this.foldersService.findOneById(folderId);
                if (!folder) throw new Error("Folder not found");
                if (!this.contentScopeService.scopesAreEqual(folder.scope, scope)) {
                    throw new Error("Folder scope doesn't match passed scope");
                }
            }

            await this.blobStorageBackendService.upload(file, contentHash, this.config.filesDirectory);

            const name = await this.findNextAvailableFilename({ filePath: file.originalname, folderId, scope });

            let exifData: Record<string, string | number | Uint8Array | number[] | Uint16Array> | undefined;
            if (exifrSupportedMimetypes.includes(file.mimetype)) {
                exifData = await exifr.parse(file.path);
            }

            result = await this.create({
                name,
                folderId: folderId,
                size: file.size,
                mimetype: file.mimetype,
                image:
                    image !== undefined
                        ? {
                              width: image.width,
                              height: image.height,
                              exif: exifData,
                              cropArea: {
                                  focalPoint: FocalPoint.SMART,
                              },
                          }
                        : undefined,
                contentHash,
                scope,
                ...assignData,
            });

            if (result.image) {
                // We do not want for our users to await the dominant color calculation. To prevent concurrency issues we must use a separate Unit of
                // Work. This can be achieved by forking the EntityManager instance.
                // See https://mikro-orm.io/docs/faq#you-cannot-call-emflush-from-inside-lifecycle-hook-handlers and
                // https://mikro-orm.io/docs/unit-of-work for more information.
                const entityManager = this.orm.em.fork();
                const image = await entityManager.findOneOrFail(DamFileImage, result.image.id);

                this.calculateDominantColor(contentHash).then((dominantColor) => {
                    image.dominantColor = dominantColor;
                    return entityManager.flush();
                });
            }
            rimraf.sync(file.path);
        } catch (e) {
            rimraf.sync(file.path);
            throw e;
        }

        return result;
    }

    async getFilePosition(fileId: string, args: Omit<DamFileListPositionArgs, "scope">, scope?: DamScopeInterface): Promise<number> {
        const isSearching = args.filter?.searchText !== undefined && args.filter.searchText.length > 0;

        const subQb = withFilesSelect(
            this.filesRepository
                .createQueryBuilder("file")
                .select(["file.id", `ROW_NUMBER() OVER( ORDER BY file."${args.sortColumnName}" ${args.sortDirection} ) AS row_number`])
                .leftJoinAndSelect("file.folder", "folder"),
            {
                archived: !args.includeArchived ? false : undefined,
                folderId: !isSearching ? args.folderId || null : undefined,
                mimetypes: args.filter?.mimetypes,
                query: args.filter?.searchText,
                sortColumnName: args.sortColumnName,
                sortDirection: args.sortDirection,
                scope,
            },
        );

        const result: { rows: Array<{ row_number: string }> } = await this.filesRepository.createQueryBuilder().raw(
            `select "file_with_row_number".row_number
                from "${FILE_TABLE_NAME}" as "file"
                join (${subQb.getFormattedQuery()}) as "file_with_row_number" ON file_with_row_number.id = file.id
                where "file"."id" = ?
            `,
            [fileId],
        );

        if (result.rows.length === 0) {
            throw new Error("File ID does not exist.");
        }

        // make the positions start with 0
        return Number(result.rows[0].row_number) - 1;
    }

    async createCopyOfFile(file: FileInterface, { inboxFolder }: { inboxFolder: FolderInterface }) {
        let fileImageInput: ImageFileInput | undefined;
        if (file.image) {
            const { id: ignoreId, file: ignoreFile, ...imageProps } = file.image;
            fileImageInput = { ...Utils.copy(imageProps) };
        }

        const {
            id: ignoreId,
            createdAt: ignoreCreatedAt,
            updatedAt: ignoreUpdatedAt,
            folder: ignoreFolder,
            image: ignoreImage,
            scope: ignoreScope,
            copies: ignoreCopies,
            ...fileProps
        } = file;

        const fileInput: CreateFileInput & { copyOf: FileInterface } = {
            ...Utils.copy(fileProps),
            image: fileImageInput,
            folderId: inboxFolder.id,
            copyOf: file,
            scope: inboxFolder.scope,
        };

        return this.create(fileInput);
    }

    async copyFilesToScope({ user, fileIds, inboxFolderId }: { user: CurrentUserInterface; fileIds: string[]; inboxFolderId: string }) {
        const inboxFolder = await this.foldersService.findOneById(inboxFolderId);
        if (!inboxFolder) {
            throw new Error("Specified inbox folder doesn't exist.");
        }
        if (inboxFolder.scope && !this.accessControlService.isAllowedContentScope(user, inboxFolder.scope)) {
            throw new Error("User can't access the target scope");
        }

        const getUniqueFileScopes = (files: FileInterface[]): DamScopeInterface[] => {
            const fileScopes: DamScopeInterface[] = [];
            for (const file of files) {
                if (file.scope === undefined) {
                    continue;
                }

                const isDuplicateScope = Boolean(fileScopes.find((scope) => this.contentScopeService.scopesAreEqual(scope, file.scope)));
                if (!isDuplicateScope) {
                    fileScopes.push(file.scope);
                }
            }
            return fileScopes;
        };

        const files = await this.findMultipleByIds(fileIds);
        if (files.length === 0) {
            throw new Error("No valid file ids provided");
        }

        const fileScopes = getUniqueFileScopes(files);
        const canAccessFileScopes = fileScopes.every((scope) => {
            return this.accessControlService.isAllowedContentScope(user, scope);
        });
        if (!canAccessFileScopes) {
            throw new Error(`User can't access the scope of one or more files`);
        }

        const mappedFiles: Array<{ rootFile: FileInterface; copy: FileInterface }> = [];
        for (const file of files) {
            const copiedFile = await this.createCopyOfFile(file, { inboxFolder });
            mappedFiles.push({ rootFile: file, copy: copiedFile });
        }

        return { mappedFiles };
    }

    async findNextAvailableFilename({
        filePath,
        folderId = null,
        scope,
    }: {
        filePath: string;
        folderId?: string | null;
        scope?: DamScopeInterface;
    }): Promise<string> {
        const extension = extname(filePath);
        const filename = basename(filePath, extension);

        let i = 1;
        let name = slugifyFilename(filename, extension);

        while ((await this.findOneByFilenameAndFolder({ filename: name, folderId }, scope)) !== null) {
            name = slugifyFilename(`${filename}-copy${i}`, extension);
            i++;
        }

        return name;
    }

    async calculateDominantColor(contentHash: string): Promise<string | undefined> {
        const path = this.imgproxyService
            .builder()
            .resize(ResizingType.AUTO, 128)
            .format(Extension.JPG)
            .generateUrl(
                `${this.blobStorageBackendService.getBackendFilePathPrefix()}${this.config.filesDirectory}/${createHashedPath(contentHash)}`,
            );

        const imgUrl = this.imgproxyService.getSignedUrl(path);
        try {
            const imageResponse = await fetch(imgUrl);
            const arrayBuffer = await imageResponse.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);

            // @TODO: make pull request to fix overloads https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/get-image-colors/index.d.ts#L15
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getColorOptions: any = { type: "image/jpg", count: 1 };

            const colors = (await getColors(imageBuffer, getColorOptions)).map((color) => color.hex());

            return colors.length > 0 ? colors[0] : undefined;
        } catch (e) {
            // When imageproxy is not available it is ok.
            console.error(e);

            return undefined;
        }
    }

    async createFileUrl(file: FileInterface, previewDamUrls?: boolean): Promise<string> {
        const filename = parse(file.name).name;

        // Use CDN url only if available and not in preview as preview requires auth
        const baseUrl = [this.config.cdnEnabled && !previewDamUrls ? `${this.config.cdnDomain}/files` : this.config.filesBaseUrl];

        if (previewDamUrls) {
            baseUrl.push("preview");
        } else {
            const hash = this.createHash({
                fileId: file.id,
                filename,
            });

            baseUrl.push(hash);
        }

        return [...baseUrl, file.id, filename].join("/");
    }

    createHash(params: FileParams): string {
        const fileHash = `file:${params.fileId}:${params.filename}`;
        return createHmac("sha1", this.config.secret).update(fileHash).digest("hex");
    }
}
