import {
    BaseEntity,
    defineConfig,
    Embeddable,
    Embedded,
    Entity,
    EntityManager,
    ManyToOne,
    MikroORM,
    PrimaryKey,
    Property,
    Ref,
} from "@mikro-orm/postgresql";
import { Test, type TestingModule } from "@nestjs/testing";

import { DiscoverService } from "../dependencies/discover.service";
import { ScopedEntity } from "../user-permissions/decorators/scoped-entity.decorator";
import { FullTextSearchService } from "./full-text-search.service";

// Entities for scope testing

@Embeddable()
class TestScope {
    @Property({ columnType: "text" })
    domain!: string;

    @Property({ columnType: "text" })
    language!: string;
}

@Entity({ tableName: "ScopedNews" })
class ScopedNews extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    title!: string;

    @Embedded(() => TestScope)
    scope!: TestScope;
}

@Entity({ tableName: "Product" })
class Product extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    name!: string;
}

@Embeddable()
class CompanyScope {
    @Property({ columnType: "text" })
    domain!: string;

    @Property({ columnType: "text" })
    language!: string;
}

@Entity({ tableName: "Company" })
class Company extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    name!: string;

    @Embedded(() => CompanyScope)
    scope!: CompanyScope;
}

@Entity({ tableName: "ScopedComment" })
@ScopedEntity("news.scope")
class ScopedComment extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    text!: string;

    @ManyToOne(() => ScopedNews)
    news!: Ref<ScopedNews>;
}

@Entity({ tableName: "ScopedTask" })
@ScopedEntity({ domain: "company.scope.domain", language: "company.scope.language" })
class ScopedTask extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    description!: string;

    @ManyToOne(() => Company)
    company!: Ref<Company>;
}

const mockEntityManager = {
    getConnection: jest.fn().mockReturnValue({}),
};

describe("FullTextSearchService - resolveScopeToSql", () => {
    let service: FullTextSearchService;
    let orm: MikroORM;

    beforeAll(async () => {
        orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [ScopedNews, TestScope, Product, Company, CompanyScope, ScopedComment, ScopedTask],
            }),
        );
    });

    afterAll(async () => {
        await orm.close();
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FullTextSearchService, { provide: DiscoverService, useValue: {} }, { provide: EntityManager, useValue: mockEntityManager }],
        }).compile();

        service = module.get<FullTextSearchService>(FullTextSearchService);
    });

    function callResolveScopeToSql(entityName: string): string {
        const metadata = orm.em.getMetadata().get(entityName);
        const entityClass = metadata.class;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (service as any).resolveScopeToSql(entityClass, metadata);
    }

    describe("direct scope embedded property", () => {
        it("builds JSON from embedded scope fields", () => {
            const result = callResolveScopeToSql("ScopedNews");
            expect(result).toBe(`jsonb_build_object('domain', "ScopedNews"."scope_domain", 'language', "ScopedNews"."scope_language")`);
        });
    });

    describe("entities without scope", () => {
        it("returns null::jsonb for entities with no scope and no @ScopedEntity", () => {
            const result = callResolveScopeToSql("Product");
            expect(result).toBe("null::jsonb");
        });
    });

    describe("@ScopedEntity with string path (relation -> embedded scope)", () => {
        it("resolves scope through a ManyToOne relation to an embedded scope", () => {
            const result = callResolveScopeToSql("ScopedComment");
            expect(result).toBe(
                `(SELECT jsonb_build_object('domain', "ScopedNews"."scope_domain", 'language', "ScopedNews"."scope_language") FROM "ScopedNews" WHERE "ScopedNews"."id" = "ScopedComment"."news_id")`,
            );
        });
    });

    describe("@ScopedEntity with object path", () => {
        it("resolves individual scope fields through relation paths", () => {
            const result = callResolveScopeToSql("ScopedTask");
            expect(result).toBe(
                `jsonb_build_object('domain', (SELECT "Company"."scope_domain" FROM "Company" WHERE "Company"."id" = "ScopedTask"."company_id"), 'language', (SELECT "Company"."scope_language" FROM "Company" WHERE "Company"."id" = "ScopedTask"."company_id"))`,
            );
        });
    });
});
