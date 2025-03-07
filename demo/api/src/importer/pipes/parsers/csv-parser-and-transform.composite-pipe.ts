import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { LoggerService } from "@nestjs/common";
import { getFields, ImportFieldMetadata } from "@src/importer/decorators/csv-column.decorator";
import { ImporterEntityClass } from "@src/importer/entities/base-import-target.entity";
import { Transform } from "stream";

import { CompositeImporterPipe } from "../importer-pipe.type";
import { CsvParsePipe, ParserOptions } from "./csv-parser.pipe";
import { DataTransformerPipe } from "./data-transformer.pipe";

export class CsvParseAndTransformPipes implements CompositeImporterPipe {
    private readonly fields: ImportFieldMetadata[];

    constructor(private readonly targetEntity: ImporterEntityClass, em: EntityManager<IDatabaseDriver<Connection>>) {
        this.fields = getFields(targetEntity);
    }

    getPipes(logger: LoggerService, parserOptions: ParserOptions): Transform[] {
        const parserPipe = new CsvParsePipe(parserOptions, this.fields).getPipe();
        const transformPipe = new DataTransformerPipe(this.targetEntity).getPipe(logger);

        const pipes: Transform[] = [parserPipe, transformPipe];
        return pipes;
    }
}
