import { Type } from "@nestjs/common";
import { Field, ObjectType } from "@nestjs/graphql";

import { FileInterface } from "../entities/file.entity";

export interface CopyFilesResponseInterface {
    numberNewlyCopiedFiles: number;
    numberAlreadyCopiedFiles: number;
    mappedFiles: Array<MappedFileInterface>;
}

export interface MappedFileInterface {
    rootFile: FileInterface;
    copy: FileInterface;
    isNewCopy: boolean;
}

export function createCopyFilesTypes({ File }: { File: Type<FileInterface> }) {
    @ObjectType()
    class CopyFilesResponse {
        @Field(() => Number)
        numberNewlyCopiedFiles: number;

        @Field(() => Number)
        numberAlreadyCopiedFiles: number;

        @Field(() => [MappedFile])
        mappedFiles: Array<MappedFile>;
    }

    @ObjectType()
    class MappedFile {
        @Field(() => File)
        rootFile: FileInterface;

        @Field(() => File)
        copy: FileInterface;

        @Field(() => Boolean)
        isNewCopy: boolean;
    }

    return { CopyFilesResponse };
}
