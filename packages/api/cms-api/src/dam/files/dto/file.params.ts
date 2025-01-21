import { IsHash, IsOptional, IsString, IsUUID } from "class-validator";

export class FileParams {
    @IsUUID()
    fileId: string;

    @IsString()
    filename: string;

    @IsOptional()
    @IsHash("md5")
    contentHash?: string;
}

export class HashFileParams extends FileParams {
    @IsHash("sha1")
    hash: string;
}
