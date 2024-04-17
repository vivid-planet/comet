import * as csv from "@fast-csv/parse";
import { EntityManager, EntityRepository, MikroORM, UseRequestContext } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import * as console from "console";
import * as fs from "fs";
import { Command, Console } from "nestjs-console";
import { v4 as uuid } from "uuid";

import { RedirectInterface } from "../../lib/redirects/entities/redirect-entity.factory";
import { PageTreeService } from "../page-tree/page-tree.service";
import { PageTreeNodeInterface } from "../page-tree/types";
import { REDIRECTS_LINK_BLOCK } from "./redirects.constants";
import { RedirectGenerationType, RedirectSourceTypeValues } from "./redirects.enum";
import { RedirectsLinkBlock } from "./redirects.module";

type Scope = { [key: string]: string };

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
        const imports = await this.readRedirectsCsv(filepath);
        let success = 0;
        let error = 0;

        for (const row of imports) {
            let node: PageTreeNodeInterface | null;
            try {
                node = await this.pageTreeService.createReadApi().getNodeByPath(row["target"]);
            } catch (e) {
                console.log(row["source"]);
                console.log(e);
                error++;
                continue;
            }

            const existingRedirect = await this.repository.findOne({ source: row.source });

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
                    });

                    success++;

                    await this.repository.flush();
                } else {
                    const redirect = this.repository.create({
                        id: uuid(),
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
                        active: true,
                        generationType: RedirectGenerationType.manual,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        comment,
                        scope: row["scope"],
                    });

                    success++;

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
                    });

                    success++;

                    await this.repository.flush();
                } else {
                    const redirect = this.repository.create({
                        id: uuid(),
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
                        active: true,
                        generationType: RedirectGenerationType.manual,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        comment,
                        scope: row["scope"],
                    });

                    success++;
                    this.repository.persist(redirect);
                }
            } else {
                console.log(`Error for Redirect ${row["source"]}`);
                error++;
            }
        }

        await this.repository.flush();
        console.log(`\nSuccess: ${success}`);
        console.log(`Error: ${error}`);
    }

    readRedirectsCsv = async (
        filePath: string,
    ): Promise<
        Array<{
            target: string;
            target_type: string;
            source: string;
            comment: string;
            scope: Scope;
        }>
    > => {
        const imports: Array<{
            target: string;
            target_type: string;
            source: string;
            comment: string;
            scope: Scope;
        }> = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true, delimiter: ";" }))
                .on("error", (error) => {
                    console.error(error);
                    reject(error);
                })
                .on("data", (row) => {
                    const hasScope = Object.keys(row).some((key) => key.startsWith("scope_"));

                    if (!hasScope) {
                        throw Error("Could not find a scope in the passed file!");
                    }

                    const scope: Scope = {};
                    Object.keys(row).forEach((key) => {
                        if (key.startsWith("scope_")) {
                            const scopeKey = key.replace("scope_", "");
                            scope[scopeKey] = row[key];
                            delete row[key];
                        }
                    });

                    row["scope"] = scope;
                    imports.push(row);
                })
                .on("end", (rowCount: number) => {
                    console.log(`Parsed ${rowCount} rows`);
                    resolve(imports);
                });
        });
    };
}
