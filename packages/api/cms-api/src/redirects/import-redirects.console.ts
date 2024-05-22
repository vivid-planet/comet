import * as csv from "@fast-csv/parse";
import { EntityManager, EntityRepository, MikroORM, UseRequestContext } from "@mikro-orm/core";
import type { FilterQuery } from "@mikro-orm/core/typings";
import { InjectRepository } from "@mikro-orm/nestjs";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import * as console from "console";
import * as fs from "fs";
import { Command, Console } from "nestjs-console";

import { PageTreeService } from "../page-tree/page-tree.service";
import { RedirectInterface } from "./entities/redirect-entity.factory";
import { REDIRECTS_LINK_BLOCK } from "./redirects.constants";
import { RedirectGenerationType, RedirectSourceTypeValues } from "./redirects.enum";
import { RedirectsLinkBlock } from "./redirects.module";
import { RedirectScopeInterface } from "./types";

interface Row {
    target: string;
    target_type: string;
    source: string;
    comment?: string;
    scope?: RedirectScopeInterface;
}

@Injectable()
@Console()
export class ImportRedirectsConsole {
    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager,
        @Inject(forwardRef(() => PageTreeService)) private readonly pageTreeService: PageTreeService,
        @InjectRepository("Redirect") private readonly repository: EntityRepository<RedirectInterface>,
        @Inject(REDIRECTS_LINK_BLOCK) private readonly linkBlock: RedirectsLinkBlock,
    ) {}

    @Command({
        command: "import-redirects [filepath] [comment]",
        description: "Import redirects from csv file",
    })
    @UseRequestContext()
    async execute(filepath: string, comment = "Imported"): Promise<void> {
        const rows = await this.readRedirectsCsv(filepath);
        let successes = 0;
        let errors = 0;

        for (const row of rows) {
            const node = await this.pageTreeService.createReadApi({ visibility: "all" }).getNodeByPath(row["target"]);

            const where: FilterQuery<RedirectInterface> = { source: row.source };
            if (row["scope"]) {
                where["scope"] = row["scope"];
            }
            const existingRedirect = await this.repository.findOne(where);

            if (row["target_type"] === "internal" && node) {
                if (existingRedirect) {
                    this.repository.assign(existingRedirect, {
                        target: this.linkBlock
                            .blockInputFactory({
                                attachedBlocks: [
                                    {
                                        type: "internal",
                                        props: {
                                            targetPageId: node.id,
                                        },
                                    },
                                ],
                                activeType: "internal",
                            })
                            .transformToBlockData(),
                        comment: row["comment"] ?? comment,
                    });

                    successes++;
                } else {
                    const redirect = this.repository.create({
                        sourceType: RedirectSourceTypeValues.path,
                        source: row["source"],
                        target: this.linkBlock
                            .blockInputFactory({
                                attachedBlocks: [
                                    {
                                        type: "internal",
                                        props: {
                                            targetPageId: node.id,
                                        },
                                    },
                                ],
                                activeType: "internal",
                            })
                            .transformToBlockData(),
                        generationType: RedirectGenerationType.manual,
                        comment: row["comment"] ?? comment,
                        scope: row["scope"],
                    });

                    successes++;

                    this.repository.persist(redirect);
                }
            } else if (row["target_type"] === "external") {
                if (existingRedirect) {
                    this.repository.assign(existingRedirect, {
                        target: this.linkBlock
                            .blockInputFactory({
                                attachedBlocks: [
                                    {
                                        type: "external",
                                        props: {
                                            targetUrl: row["target"],
                                            openInNewWindow: true,
                                        },
                                    },
                                ],
                                activeType: "external",
                            })
                            .transformToBlockData(),
                        comment: row["comment"] ?? comment,
                    });

                    successes++;
                } else {
                    const redirect = this.repository.create({
                        sourceType: RedirectSourceTypeValues.path,
                        source: row["source"],
                        target: this.linkBlock
                            .blockInputFactory({
                                attachedBlocks: [
                                    {
                                        type: "external",
                                        props: {
                                            targetUrl: row["target"],
                                            openInNewWindow: true,
                                        },
                                    },
                                ],
                                activeType: "external",
                            })
                            .transformToBlockData(),
                        generationType: RedirectGenerationType.manual,
                        comment: row["comment"] ?? comment,
                        scope: row["scope"],
                    });

                    successes++;
                    this.repository.persist(redirect);
                }
            } else {
                console.log(`Error for Redirect ${row["source"]}`);
                errors++;
            }
        }

        await this.repository.flush();
        console.log(`\nSuccess: ${successes}`);
        console.log(`Error: ${errors}`);
    }

    readRedirectsCsv = async (filePath: string): Promise<Row[]> => {
        const imports: Row[] = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true, delimiter: ";" }))
                .on("error", (error) => {
                    console.error(error);
                    reject(error);
                })
                .on("data", (row: Row & Record<string, string>) => {
                    const scope: RedirectScopeInterface = {};
                    Object.keys(row).forEach((key) => {
                        if (key.startsWith("scope_")) {
                            const scopeKey = key.replace("scope_", "");
                            scope[scopeKey] = row[key];
                            delete row[key];
                        }
                    });

                    row["scope"] = Object.keys(scope).length > 0 ? scope : undefined;

                    imports.push(row);
                })
                .on("end", (rowCount: number) => {
                    console.log(`Parsed ${rowCount} rows`);
                    resolve(imports);
                });
        });
    };
}
