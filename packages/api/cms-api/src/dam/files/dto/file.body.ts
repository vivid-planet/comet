import { IsOptional, IsString } from "class-validator";

export class UploadFileBody {
    @IsOptional()
    @IsString()
    folderId?: string;
}
