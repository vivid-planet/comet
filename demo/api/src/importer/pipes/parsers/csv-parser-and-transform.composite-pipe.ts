import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { LoggerService } from "@nestjs/common";
import { CsvColumnMetadata, getCsvColumns } from "@src/importer/decorators/csv-column.decorator";
import { FieldTransformerData, getFieldTransformers } from "@src/importer/decorators/field-transformer.decorator";
import { ImporterEntityClass } from "@src/importer/entities/base-target.entity";
import { getEntityProperties, TargetEntityProperties } from "@src/importer/entities/target-entity.utils";
import { Transform } from "stream";

import { CompositeImporterPipe } from "../importer-pipe.type";
import { CsvDataTransformerPipe } from "./csv-data-transformer.pipe";
import { CsvParsePipe, ParserOptions } from "./csv-parser.pipe";

export class CsvParseAndTransformPipes implements CompositeImporterPipe {
    private readonly targetEntityProperties: TargetEntityProperties;
    private readonly fieldTransformers: FieldTransformerData[];
    private readonly dateFormatString: string;
    private readonly csvColumns: CsvColumnMetadata[];

    constructor(private readonly targetEntity: ImporterEntityClass, em: EntityManager<IDatabaseDriver<Connection>>) {
        this.fieldTransformers = getFieldTransformers(targetEntity);
        this.csvColumns = getCsvColumns(targetEntity);
        this.targetEntityProperties = getEntityProperties(em, this.targetEntity.name);
    }

    getPipes(logger: LoggerService, parserOptions: ParserOptions): Transform[] {
        const parserPipe = new CsvParsePipe(parserOptions, this.csvColumns).getPipe();
        const transformPipe = new CsvDataTransformerPipe(
            {
                fields: this.csvColumns,
                targetEntityProperties: this.targetEntityProperties,
                entityDateFormatString: this.dateFormatString,
                fieldTransformers: this.fieldTransformers,
            },
            this.targetEntity,
        ).getPipe(logger);

        const pipes: Transform[] = [parserPipe, transformPipe];
        return pipes;
    }
}
