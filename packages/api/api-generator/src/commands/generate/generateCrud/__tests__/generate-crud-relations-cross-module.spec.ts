import { existsSync } from "node:fs";
import * as path from "node:path";

import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage.js";
import { describe, expect, it } from "vitest";

import { formatGeneratedFiles, parseSource, testPermission } from "../../utils/test-helper";
import { buildOptions } from "../build-options";
import { generateCrud } from "../generate-crud";
import { Article } from "./cross-module-fixtures/articles/entities/article.entity";
import { ArticleToPeriodical } from "./cross-module-fixtures/periodicals/entities/article-to-periodical.entity";
import { Periodical } from "./cross-module-fixtures/periodicals/entities/periodical.entity";

describe("generate-crud relations cross module", () => {
    it("should emit the join-entity resolver into the join entity's module with correct imports", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [Article, Periodical, ArticleToPeriodical],
            }),
        );

        const articleMetadata = orm.em.getMetadata().get("Article");
        const joinMetadata = orm.em.getMetadata().get("ArticleToPeriodical");

        const out = await generateCrud({ requiredPermission: testPermission }, articleMetadata);
        const formattedOut = await formatGeneratedFiles(out);

        const file = formattedOut.find((file) => file.name === "article-to-periodical.resolver.ts");
        if (!file) {
            throw new Error("File not found");
        }

        // The join entity lives in a different module than the referencing Article entity. The resolver must be written
        // into the join entity's own module, not the referencing module – otherwise its `../entities/…` imports break.
        const { targetDirectory: joinTargetDirectory } = buildOptions(joinMetadata, { requiredPermission: testPermission });
        expect(file.targetDirectory).toBe(joinTargetDirectory);

        // Every relative import must resolve to an existing file when resolved against the resolver's target directory.
        const source = parseSource(file.content);
        for (const tsImport of source.getImportDeclarations()) {
            const moduleSpecifier = tsImport.getModuleSpecifierValue();
            if (!moduleSpecifier.startsWith(".")) {
                continue;
            }
            const resolved = path.resolve(joinTargetDirectory, `${moduleSpecifier}.ts`);
            expect(existsSync(resolved), `import "${moduleSpecifier}" should resolve to an existing file`).toBe(true);
        }

        await orm.close();
    });
});
