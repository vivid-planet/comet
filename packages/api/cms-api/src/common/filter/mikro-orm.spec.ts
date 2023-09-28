import { BooleanFilter } from "./boolean.filter";
import { DateFilter } from "./date.filter";
import { filtersToMikroOrmQuery, filterToMikroOrmQuery, searchToMikroOrmQuery } from "./mikro-orm";
import { NumberFilter } from "./number.filter";
import { StringFilter } from "./string.filter";

describe("searchToMikroOrmQuery", () => {
    it("should work", async () => {
        expect(searchToMikroOrmQuery("foo", ["title", "description"])).toStrictEqual({
            $or: [{ title: { $ilike: "%foo%" } }, { description: { $ilike: "%foo%" } }],
        });
    });
    it("should escape %", async () => {
        expect(searchToMikroOrmQuery("fo%o", ["title", "description"])).toStrictEqual({
            $or: [{ title: { $ilike: "%fo\\%o%" } }, { description: { $ilike: "%fo\\%o%" } }],
        });
    });
    it("should escape _", async () => {
        expect(searchToMikroOrmQuery("fo_o", ["title", "description"])).toStrictEqual({
            $or: [{ title: { $ilike: "%fo\\_o%" } }, { description: { $ilike: "%fo\\_o%" } }],
        });
    });
    it("should split by spaces", async () => {
        expect(searchToMikroOrmQuery("foo bar", ["title", "description"])).toStrictEqual({
            $or: [
                { title: { $ilike: "%foo%" } },
                { title: { $ilike: "%bar%" } },
                { description: { $ilike: "%foo%" } },
                { description: { $ilike: "%bar%" } },
            ],
        });
    });
});

describe("filterToMikroOrmQuery", () => {
    it("string equal", async () => {
        const f = new StringFilter();
        f.equal = "foo";

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $eq: "foo",
        });
    });
    it("string not equal", async () => {
        const f = new StringFilter();
        f.notEqual = "foo";

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $ne: "foo",
        });
    });
    it("string contains", async () => {
        const f = new StringFilter();
        f.contains = "foo";

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $ilike: "%foo%",
        });
    });
    it("string contains escape %", async () => {
        const f = new StringFilter();
        f.contains = "fo%o";

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $ilike: "%fo\\%o%",
        });
    });
    it("string contains escape _", async () => {
        const f = new StringFilter();
        f.contains = "fo_o";

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $ilike: "%fo\\_o%",
        });
    });
    it("string starts with", async () => {
        const f = new StringFilter();
        f.startsWith = "foo";

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $ilike: "foo%",
        });
    });
    it("string ends with", async () => {
        const f = new StringFilter();
        f.endsWith = "foo";

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $ilike: "%foo",
        });
    });
    it("string starts with and contains", async () => {
        const f = new StringFilter();
        f.endsWith = "foo";
        f.contains = "bar";

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $and: [{ test: { $ilike: "%bar%" } }, { test: { $ilike: "%foo" } }],
        });
    });
    it("number equals", async () => {
        const f = new NumberFilter();
        f.equal = 123;

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $eq: 123,
        });
    });
    it("number not equals", async () => {
        const f = new NumberFilter();
        f.notEqual = 123;

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $ne: 123,
        });
    });
    it("number gt", async () => {
        const f = new NumberFilter();
        f.greaterThan = 123;

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $gt: 123,
        });
    });
    it("boolean equals", async () => {
        const f = new BooleanFilter();
        f.equal = true;

        expect(filterToMikroOrmQuery(f, "test")).toStrictEqual({
            $eq: true,
        });
    });
});

class FooFilter {
    and?: FooFilter[];
    or?: FooFilter[];
    foo?: StringFilter;
}
class Equals42 {}
class Foo2Filter {
    foo?: Equals42;
    str?: StringFilter;
}
describe("filtersToMikroOrmQuery", () => {
    it("string equal", async () => {
        const f = new FooFilter();
        f.foo = new StringFilter();
        f.foo.equal = "bar";

        expect(filtersToMikroOrmQuery(f)).toStrictEqual({
            foo: {
                $eq: "bar",
            },
        });
    });
    it("and filter", async () => {
        const f = new FooFilter();
        f.and = [new FooFilter(), new FooFilter()];
        f.and[0].foo = new StringFilter();
        f.and[0].foo.contains = "abc";
        f.and[1].foo = new StringFilter();
        f.and[1].foo.contains = "123";

        expect(filtersToMikroOrmQuery(f)).toStrictEqual({
            $and: [
                {
                    foo: {
                        $ilike: "%abc%",
                    },
                },
                {
                    foo: {
                        $ilike: "%123%",
                    },
                },
            ],
        });
    });
    it("or filter", async () => {
        const f = new FooFilter();
        f.or = [new FooFilter(), new FooFilter()];
        f.or[0].foo = new StringFilter();
        f.or[0].foo.contains = "abc";
        f.or[1].foo = new StringFilter();
        f.or[1].foo.contains = "123";

        expect(filtersToMikroOrmQuery(f)).toStrictEqual({
            $or: [
                {
                    foo: {
                        $ilike: "%abc%",
                    },
                },
                {
                    foo: {
                        $ilike: "%123%",
                    },
                },
            ],
        });
    });
    it("custom apply filter", async () => {
        const f = new Foo2Filter();
        f.foo = new Equals42();

        expect(
            filtersToMikroOrmQuery(f, (acc, filterValue, filterKey) => {
                if (filterValue instanceof Equals42) {
                    acc[filterKey] = 42;
                } else {
                    throw new Error("unsupported filter");
                }
            }),
        ).toStrictEqual({
            foo: 42,
        });
    });
    it("custom apply filter with default fallback", async () => {
        const f = new Foo2Filter();
        f.foo = new Equals42();
        f.str = new StringFilter();
        f.str.contains = "abc";
        expect(
            filtersToMikroOrmQuery(f, (acc, filterValue, filterKey) => {
                if (filterValue instanceof Equals42) {
                    acc[filterKey] = 42;
                } else if (
                    filterValue instanceof StringFilter ||
                    filterValue instanceof NumberFilter ||
                    filterValue instanceof DateFilter ||
                    filterValue instanceof BooleanFilter
                ) {
                    acc[filterKey] = filterToMikroOrmQuery(filterValue, filterKey);
                } else {
                    throw new Error("unsupported filter");
                }
            }),
        ).toStrictEqual({
            foo: 42,
            str: {
                $ilike: "%abc%",
            },
        });
    });
    it("empty filter", async () => {
        const f = new FooFilter();
        f.foo = new StringFilter();

        expect(filtersToMikroOrmQuery(f)).toStrictEqual({});
    });
});
