import { IsHash, IsString, IsUUID } from "class-validator";

export class FileParams {
    @IsUUID()
    fileId: string;

    @IsString()
    filename: string;
}

export class HashFileParams extends FileParams {
    @IsHash("sha1")
    hash: string;
}
