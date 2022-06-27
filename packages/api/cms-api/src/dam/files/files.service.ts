import { MikroORM } from "@mikro-orm/core";
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

import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { CometEntityNotFoundException } from "../../common/errors/entity-not-found.exception";
import { SortDirection } from "../../common/sorting/sort-direction.enum";
import { FocalPoint } from "../common/enums/focal-point.enum";
import { CometImageResolutionException } from "../common/errors/image-resolution.exception";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG, IMGPROXY_CONFIG } from "../dam.constants";
import { Extension, ResizingType } from "../imgproxy/imgproxy.enum";
import { ImgproxyConfig, ImgproxyService } from "../imgproxy/imgproxy.service";
import { FileArgs } from "./dto/file.args";
import { CreateFileInput, UpdateFileInput } from "./dto/file.input";
import { FileParams } from "./dto/file.params";
import { FileUploadInterface } from "./dto/file-upload.interface";
import { File } from "./entities/file.entity";
import { FileImage } from "./entities/file-image.entity";
import { createHashedPath, slugifyFilename } from "./files.utils";
import { FoldersService } from "./folders.service";

export const withFilesSelect = (
    qb: QueryBuilder<File>,
    args: {
        query?: string;
        id?: string;
        filename?: string;
        folderId?: string | null;
        imageId?: string;
        contentHash?: string;
        archived?: boolean;
        mimetypes?: string[];
        sortColumnName?: string;
        sortDirection?: SortDirection;
    },
): QueryBuilder<File> => {
    if (args.query) {
        qb.andWhere("file.name ILIKE ANY (ARRAY[?])", [args.query.split(" ").map((term) => `%${term}%`)]);
    }
    if (args.id) qb.andWhere({ id: args.id });
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
    if (args.mimetypes !== undefined) {
        qb.andWhere({ mimetype: { $in: args.mimetypes } });
    }

    if (args.imageId) qb.andWhere({ image: { id: args.imageId } });

    if (args.sortColumnName && args.sortDirection) {
        qb.orderBy({ [`file.${args.sortColumnName}`]: args.sortDirection });
    }

    return qb;
};

@Injectable()
export class FilesService {
    protected readonly logger = new Logger(FilesService.name);
    static readonly UPLOAD_FIELD = "file";

    constructor(
        @InjectRepository(File) private readonly filesRepository: EntityRepository<File>,
        @InjectRepository(FileImage) private readonly fileImagesRepository: EntityRepository<FileImage>,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
        private readonly foldersService: FoldersService,
        @Inject(IMGPROXY_CONFIG) private readonly imgproxyConfig: ImgproxyConfig,
        @Inject(DAM_CONFIG) private readonly config: DamConfig,
        private readonly imgproxyService: ImgproxyService,
        private readonly orm: MikroORM,
    ) {}

    private selectQueryBuilder(): QueryBuilder<File> {
        return this.filesRepository
            .createQueryBuilder("file")
            .select("*")
            .leftJoinAndSelect("file.image", "image")
            .leftJoinAndSelect("file.folder", "folder");
    }

    async findAll({ folderId, includeArchived, filter, sortColumnName, sortDirection }: FileArgs): Promise<File[]> {
        const isSearching = filter?.searchText !== undefined && filter.searchText.length > 0;

        return withFilesSelect(this.selectQueryBuilder(), {
            archived: !includeArchived ? false : undefined,
            folderId: !isSearching ? folderId || null : undefined,
            mimetypes: filter?.mimetypes,
            query: filter?.searchText,
            sortColumnName,
            sortDirection,
        }).getResult();
    }

    async findAllByHash(contentHash: string): Promise<File[]> {
        return withFilesSelect(this.selectQueryBuilder(), { contentHash }).getResult();
    }

    async findOneById(id: string): Promise<File | null> {
        return withFilesSelect(this.selectQueryBuilder(), { id }).getSingleResult();
    }

    async getDamPath(file: File): Promise<string> {
        const folderNames = file.folder ? (await this.foldersService.findAncestorsByParentId(file.folder.id)).map((folder) => folder.name) : [];
        return `/${folderNames.join("/")}`;
    }

    async findOneByHash(contentHash: string): Promise<File | null> {
        return withFilesSelect(this.selectQueryBuilder(), { contentHash }).getSingleResult();
    }

    async findOneByFilenameAndFolder(filename: string, folderId: string | null = null): Promise<File | null> {
        return withFilesSelect(this.selectQueryBuilder(), { folderId: folderId || null, filename }).getSingleResult();
    }

    async findOneByImageId(imageId: string): Promise<File | null> {
        return withFilesSelect(this.selectQueryBuilder(), { imageId }).getSingleResult();
    }

    async create({ folderId, ...data }: CreateFileInput): Promise<File> {
        const folder = folderId ? await this.foldersService.findOneById(folderId) : undefined;
        return this.save(this.filesRepository.create({ ...data, folder }));
    }

    async updateById(id: string, data: UpdateFileInput): Promise<File> {
        const file = await this.findOneById(id);
        if (!file) throw new CometEntityNotFoundException();
        return this.updateByEntity(file, data);
    }

    async updateByEntity(entity: File, { folderId, image, ...input }: UpdateFileInput): Promise<File> {
        const folder = folderId ? await this.foldersService.findOneById(folderId) : null;

        if (entity.image && image?.cropArea) {
            entity.image.cropArea = image.cropArea;
        }

        const file = Object.assign(entity, {
            ...input,
            folder: folderId !== undefined ? folder : entity.folder,
        });
        return this.save(file);
    }

    async moveBatch(fileIds: string[], targetFolderId?: string): Promise<File[]> {
        const files = [];

        for (const id of fileIds) {
            const file = await this.updateById(id, { folderId: targetFolderId });
            files.push(file);
        }

        return files;
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

    async save(entity: File): Promise<File> {
        await this.filesRepository.persistAndFlush(entity);
        return entity;
    }

    async upload(file: FileUploadInterface, folderId?: string): Promise<File> {
        let result: File | undefined = undefined;
        try {
            const contentHash = await hasha.fromFile(file.path, { algorithm: "md5" });
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

            await this.blobStorageBackendService.upload(file, contentHash, this.config.filesDirectory);

            //TODO: let user decide to change name or override file
            const extension = extname(file.originalname);
            const filename = basename(file.originalname, extension);
            let i = 1;
            let name = slugifyFilename(filename, extension);
            while ((await this.findOneByFilenameAndFolder(name, folderId)) !== null) {
                name = slugifyFilename(`${filename}-${i}`, extension);
                i++;
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
                              exif: await exifr.parse(file.path),
                              cropArea: {
                                  focalPoint: FocalPoint.SMART,
                              },
                          }
                        : undefined,
                contentHash,
            });

            if (result.image) {
                // We do not want for our users to await the dominant color calculation. To prevent concurrency issues we must use a separate Unit of
                // Work. This can be achieved by forking the EntityManager instance.
                // See https://mikro-orm.io/docs/faq#you-cannot-call-emflush-from-inside-lifecycle-hook-handlers and
                // https://mikro-orm.io/docs/unit-of-work for more information.
                const entityManager = this.orm.em.fork();
                const image = await entityManager.findOneOrFail(FileImage, result.image.id);

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

    async createFileUrl(file: File, previewDamUrls?: boolean): Promise<string> {
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
