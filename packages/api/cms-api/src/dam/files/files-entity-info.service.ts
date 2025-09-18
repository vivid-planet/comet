import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { EntityInfoServiceInterface } from "../../common/entityInfo/entity-info.decorator.js";
import { FileInterface } from "./entities/file.entity.js";
import { FilesService } from "./files.service.js";

@Injectable()
export class FilesEntityInfoService implements EntityInfoServiceInterface<FileInterface> {
    constructor(
        @Inject(forwardRef(() => FilesService))
        private readonly filesService: FilesService,
    ) {}

    async getEntityInfo(file: FileInterface) {
        return { name: file.name, secondaryInformation: await this.filesService.getDamPath(file) };
    }
}
