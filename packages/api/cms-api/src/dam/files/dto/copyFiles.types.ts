import { Type } from "@nestjs/common";
import { Field, ObjectType } from "@nestjs/graphql";

import { FileInterface } from "../entities/file.entity";

export interface CopyDamFilesResponseInterface {
    mappedFiles: Array<MappedFileInterface>;
}

export interface MappedFileInterface {
    rootFile: FileInterface;
    copy: FileInterface;
}

export function createCopyDamFilesResponseType({ File }: { File: Type<FileInterface> }) {
    @ObjectType()
    class CopyDamFilesResponse implements CopyDamFilesResponseInterface {
        @Field(() => [MappedFile])
        mappedFiles: Array<MappedFile>;
    }

    @ObjectType()
    class MappedFile implements MappedFileInterface {
        @Field(() => File)
        rootFile: FileInterface;

        @Field(() => File)
        copy: FileInterface;
    }

    return CopyDamFilesResponse;
}
