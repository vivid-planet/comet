import { generateGqlOperation } from "../generateGqlOperation";

function normalizeSpaces(str: string) {
    return str.replace(/\s+/g, " ").trim();
}
describe("generateGqlOperation", () => {
    it("generates query without variables", () => {
        const result = generateGqlOperation({
            type: "query",
            operationName: "TestQuery",
            rootOperation: "testQuery",
            variables: [],
            fields: ["field1", "field2"],
        });

        expect(normalizeSpaces(result)).toBe(
            normalizeSpaces(`query TestQuery {
                testQuery {
                    field1
                    field2
                }
        }`),
        );
    });
    it("generates query with variable", () => {
        const result = generateGqlOperation({
            type: "query",
            operationName: "TestQuery",
            rootOperation: "testQuery",
            variables: [
                {
                    name: "var1",
                    type: "String",
                },
            ],
            fields: ["field1", "field2"],
        });

        expect(normalizeSpaces(result)).toBe(
            normalizeSpaces(`query TestQuery($var1: String) {
                testQuery(var1: $var1) {
                    field1
                    field2
                }
        }`),
        );
    });

    it("generates query with nested fields", () => {
        const result = generateGqlOperation({
            type: "query",
            operationName: "TestQuery",
            rootOperation: "testQuery",
            variables: [],
            fields: ["field1.foo", "field2"],
        });

        expect(normalizeSpaces(result)).toBe(
            normalizeSpaces(`query TestQuery {
                testQuery {
                    field1 {
                        foo
                    }
                    field2
                }
        }`),
        );
    });

    it("generates query with root fragment", () => {
        const result = generateGqlOperation({
            type: "query",
            operationName: "TestQuery",
            rootOperation: "testQuery",
            variables: [],
            fields: ["field1", "...FragmentName"],
            fragmentVariables: ["${fragment}"],
        });

        expect(normalizeSpaces(result)).toBe(
            normalizeSpaces(`query TestQuery {
                testQuery {
                    field1
                    ...FragmentName
                }
            }
            \${fragment}`),
        );
    });

    it("generates query with two root fragments", () => {
        const result = generateGqlOperation({
            type: "query",
            operationName: "TestQuery",
            rootOperation: "testQuery",
            variables: [],
            fields: ["field1", "...FragmentName", "...Fragment2"],
            fragmentVariables: ["${fragment}"],
        });

        expect(normalizeSpaces(result)).toBe(
            normalizeSpaces(`query TestQuery {
                testQuery {
                    field1
                    ...FragmentName
                    ...Fragment2
                }
            }
            \${fragment}`),
        );
    });
    it("generates query with nested fragment", () => {
        const result = generateGqlOperation({
            type: "query",
            operationName: "TestQuery",
            rootOperation: "testQuery",
            variables: [],
            fields: ["field1", "field2.foo", "field2...FragmentName", "field2.bar"],
            fragmentVariables: ["${fragment}"],
        });

        expect(normalizeSpaces(result)).toBe(
            normalizeSpaces(`query TestQuery {
                testQuery {
                    field1
                    field2 {
                        foo
                        bar
                        ...FragmentName
                    }
                }
            }
            \${fragment}`),
        );
    });
});
