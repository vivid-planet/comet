import { Type } from "@nestjs/common";
import { Field, ObjectType } from "@nestjs/graphql";

import { FileInterface } from "../entities/file.entity";

export interface CopyFilesResponseInterface {
    numberNewlyCopiedFiles: number;
    numberAlreadyCopiedFiles: number;
    inboxFolderId?: string;
    mappedFiles: Array<MappedFileInterface>;
}

export interface MappedFileInterface {
    rootFile: FileInterface;
    copy: FileInterface;
}

export function createCopyFilesResponseType({ File }: { File: Type<FileInterface> }) {
    @ObjectType()
    class CopyFilesResponse {
        @Field(() => Number)
        numberNewlyCopiedFiles: number;

        @Field(() => Number)
        numberAlreadyCopiedFiles: number;

        @Field(() => String, { nullable: true })
        inboxFolderId?: string;

        @Field(() => [MappedFile])
        mappedFiles: Array<MappedFile>;
    }

    @ObjectType()
    class MappedFile {
        @Field(() => File)
        rootFile: FileInterface;

        @Field(() => File)
        copy: FileInterface;
    }

    return CopyFilesResponse;
}
