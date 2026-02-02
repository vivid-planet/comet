import { raw } from "@mikro-orm/postgresql";

import { BooleanFilter } from "./boolean.filter";
import { DateTimeFilter } from "./date-time.filter";
import { type IdFilter } from "./id.filter";
import { createManyToOneFilter, ManyToOneFilter } from "./many-to-one.filter";
import { applyFilterToMikroOrmQuery, filtersToMikroOrmQuery, searchToMikroOrmQuery, splitSearchString } from "./mikro-orm";
import { NumberFilter } from "./number.filter";
import { StringFilter } from "./string.filter";

// Mock the raw helper to workaround different indices in the keys.
// See https://github.com/mikro-orm/mikro-orm/blob/master/packages/core/src/utils/RawQueryFragment.ts#L21.
jest.mock("@mikro-orm/postgresql", () => ({
    ...jest.requireActual("@mikro-orm/postgresql"),
    raw: jest.fn((argument) => {
        if (typeof argument === "function") {
            return argument("alias");
        }
        return argument;
    }),
}));

describe("splitSearchString", () => {
    it("should split a simple space-separated string", () => {
        const input = "This is a test";
        const expected = ["%This%", "%is%", "%a%", "%test%"];
        expect(splitSearchString(input)).toEqual(expected);
    });

    it("should handle quoted strings as single tokens", () => {
        const input = 'This is a "quoted string"';
        const expected = ["%This%", "%is%", "%a%", "%quoted string%"];
        expect(splitSearchString(input)).toEqual(expected);
    });

    it("should handle escaped quotes within quoted strings", () => {
        const input = 'This is a "quoted \\"string\\""';
        const expected = ["%This%", "%is%", "%a%", '%quoted "string"%'];
        expect(splitSearchString(input)).toEqual(expected);
    });

    it("should handle single quotes", () => {
        const input = "This is a 'quoted string'";
        const expected = ["%This%", "%is%", "%a%", "%quoted string%"];
        expect(splitSearchString(input)).toEqual(expected);
    });

    it("should handle escaped quotes within single quoted strings", () => {
        const input = "This is a 'quoted \\'string\\''";
        const expected = ["%This%", "%is%", "%a%", "%quoted 'string'%"];
        expect(splitSearchString(input)).toEqual(expected);
    });

    it("should handle mixed quotes", () => {
        const input = "This \"is a\" 'test'";
        const expected = ["%This%", "%is a%", "%test%"];
        expect(splitSearchString(input)).toEqual(expected);
    });

    it("should handle empty strings", () => {
        const input = "";
        const expected: string[] = [];
        expect(splitSearchString(input)).toEqual(expected);
    });

    it("should handle strings with special characters", () => {
        const input = "This is a test with % and _ characters";
        const expected = ["%This%", "%is%", "%a%", "%test%", "%with%", "%\\%%", "%and%", "%\\_%", "%characters%"];
        expect(splitSearchString(input)).toEqual(expected);
    });

    it("should handle strings with only special characters", () => {
        const input = "% _";
        const expected = ["%\\%%", "%\\_%"];
        expect(splitSearchString(input)).toEqual(expected);
    });
});

describe("searchToMikroOrmQuery", () => {
    it("should work", async () => {
        expect(searchToMikroOrmQuery("foo", ["title", "description"])).toStrictEqual({
            $and: [
                {
                    $or: [{ title: { $ilike: "%foo%" } }, { description: { $ilike: "%foo%" } }],
                },
            ],
        });
    });
    it("should escape %", async () => {
        expect(searchToMikroOrmQuery("fo%o", ["title", "description"])).toStrictEqual({
            $and: [
                {
                    $or: [{ title: { $ilike: "%fo\\%o%" } }, { description: { $ilike: "%fo\\%o%" } }],
                },
            ],
        });
    });
    it("should escape _", async () => {
        expect(searchToMikroOrmQuery("fo_o", ["title", "description"])).toStrictEqual({
            $and: [
                {
                    $or: [{ title: { $ilike: "%fo\\_o%" } }, { description: { $ilike: "%fo\\_o%" } }],
                },
            ],
        });
    });
    it("should split by spaces", async () => {
        expect(searchToMikroOrmQuery("foo bar", ["title", "description"])).toStrictEqual({
            $and: [
                {
                    $or: [{ title: { $ilike: "%foo%" } }, { description: { $ilike: "%foo%" } }],
                },
                {
                    $or: [{ title: { $ilike: "%bar%" } }, { description: { $ilike: "%bar%" } }],
                },
            ],
        });
    });
    it("should ignore leading and trailing spaces", async () => {
        expect(searchToMikroOrmQuery(" a ", ["title"])).toStrictEqual({
            $and: [{ $or: [{ title: { $ilike: "%a%" } }] }],
        });
    });
    it("adds a ::text cast", async () => {
        expect(searchToMikroOrmQuery("foo", ["title", "description", { name: "id", needsCastToText: true }])).toStrictEqual({
            $and: [
                {
                    $or: [
                        { title: { $ilike: "%foo%" } },
                        { description: { $ilike: "%foo%" } },
                        { [raw((alias) => `${alias}."id"::text`)]: { $ilike: "%foo%" } },
                    ],
                },
            ],
        });
    });
});

describe("applyFilterToMikroOrmQuery", () => {
    it("string equal", async () => {
        const f = new StringFilter();
        f.equal = "foo";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $eq: "foo",
            },
        });
    });
    it("string not equal", async () => {
        const f = new StringFilter();
        f.notEqual = "foo";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $ne: "foo",
            },
        });
    });
    it("string contains", async () => {
        const f = new StringFilter();
        f.contains = "foo";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $ilike: "%foo%",
            },
        });
    });
    it("string contains escape %", async () => {
        const f = new StringFilter();
        f.contains = "fo%o";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $ilike: "%fo\\%o%",
            },
        });
    });
    it("string contains escape _", async () => {
        const f = new StringFilter();
        f.contains = "fo_o";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $ilike: "%fo\\_o%",
            },
        });
    });
    it("string notContains", async () => {
        const f = new StringFilter();
        f.notContains = "foo";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            $not: {
                test: {
                    $ilike: "%foo%",
                },
            },
        });
    });
    it("string notContains with existing $not for multiple fields", async () => {
        const f = new StringFilter();
        f.notContains = "foo";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test1");

        applyFilterToMikroOrmQuery(acc, f, "test2");
        expect(acc).toStrictEqual({
            $not: {
                $and: [
                    {
                        test1: {
                            $ilike: "%foo%",
                        },
                    },
                    {
                        test2: {
                            $ilike: "%foo%",
                        },
                    },
                ],
            },
        });
    });
    it("string notContains with existing $not.$and for multiple fields", async () => {
        const f = new StringFilter();
        f.notContains = "foo";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test1");
        applyFilterToMikroOrmQuery(acc, f, "test2");
        applyFilterToMikroOrmQuery(acc, f, "test3");
        expect(acc).toStrictEqual({
            $not: {
                $and: [
                    {
                        test1: {
                            $ilike: "%foo%",
                        },
                    },
                    {
                        test2: {
                            $ilike: "%foo%",
                        },
                    },
                    {
                        test3: {
                            $ilike: "%foo%",
                        },
                    },
                ],
            },
        });
    });
    it("string starts with", async () => {
        const f = new StringFilter();
        f.startsWith = "foo";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $ilike: "foo%",
            },
        });
    });
    it("string ends with", async () => {
        const f = new StringFilter();
        f.endsWith = "foo";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $ilike: "%foo",
            },
        });
    });
    it("string starts with and contains", async () => {
        const f = new StringFilter();
        f.endsWith = "foo";
        f.contains = "bar";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            $and: [{ test: { $ilike: "%bar%" } }, { test: { $ilike: "%foo" } }],
        });
    });
    it("string starts with and contains for multiple fields", async () => {
        const f = new StringFilter();
        f.endsWith = "foo";
        f.contains = "bar";

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test1");
        applyFilterToMikroOrmQuery(acc, f, "test2");
        expect(acc).toStrictEqual({
            $and: [{ test1: { $ilike: "%bar%" } }, { test1: { $ilike: "%foo" } }, { test2: { $ilike: "%bar%" } }, { test2: { $ilike: "%foo" } }],
        });
    });
    it("number equals", async () => {
        const f = new NumberFilter();
        f.equal = 123;

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $eq: 123,
            },
        });
    });
    it("number not equals", async () => {
        const f = new NumberFilter();
        f.notEqual = 123;

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $ne: 123,
            },
        });
    });
    it("number gt", async () => {
        const f = new NumberFilter();
        f.greaterThan = 123;

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $gt: 123,
            },
        });
    });
    it("boolean equals", async () => {
        const f = new BooleanFilter();
        f.equal = true;

        const acc = {};
        applyFilterToMikroOrmQuery(acc, f, "test");
        expect(acc).toStrictEqual({
            test: {
                $eq: true,
            },
        });
    });
    describe("ManyToOneFilter", () => {
        it("simple contains", async () => {
            const f = new ManyToOneFilter();
            f.equal = "id1";

            const acc = {};
            applyFilterToMikroOrmQuery(acc, f, "test");
            expect(acc).toStrictEqual({
                test: {
                    $eq: "id1",
                },
            });
        });
        it("nested filter", async () => {
            class CategoryFilter {
                id?: IdFilter;
                and?: CategoryFilter[];
                or?: CategoryFilter[];
                title?: StringFilter;
            }
            const f = new (createManyToOneFilter(CategoryFilter))();
            f.filter = new CategoryFilter();
            f.filter.title = new StringFilter();
            f.filter.title.equal = "bar";

            const acc = {};
            applyFilterToMikroOrmQuery(acc, f, "category");
            expect(acc).toStrictEqual({
                category: {
                    title: {
                        $eq: "bar",
                    },
                },
            });
        });
        it("nested filter with $not", async () => {
            class CategoryFilter {
                id?: IdFilter;
                and?: CategoryFilter[];
                or?: CategoryFilter[];
                title?: StringFilter;
            }
            const f = new (createManyToOneFilter(CategoryFilter))();
            f.filter = new CategoryFilter();
            f.filter.title = new StringFilter();
            f.filter.title.notContains = "bar";

            const acc = {};
            applyFilterToMikroOrmQuery(acc, f, "category");
            expect(acc).toStrictEqual({
                $not: {
                    category: {
                        title: {
                            $ilike: "%bar%",
                        },
                    },
                },
            });
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
            filtersToMikroOrmQuery(f, {
                applyFilter: (acc, filterValue, filterKey) => {
                    if (filterValue instanceof Equals42) {
                        acc[filterKey] = 42;
                    } else {
                        throw new Error("unsupported filter");
                    }
                },
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
            filtersToMikroOrmQuery(f, {
                applyFilter: (acc, filterValue, filterKey) => {
                    if (filterValue instanceof Equals42) {
                        acc[filterKey] = 42;
                    } else if (
                        filterValue instanceof StringFilter ||
                        filterValue instanceof NumberFilter ||
                        filterValue instanceof DateTimeFilter ||
                        filterValue instanceof BooleanFilter
                    ) {
                        applyFilterToMikroOrmQuery(acc, filterValue, filterKey);
                    } else {
                        throw new Error("unsupported filter");
                    }
                },
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
