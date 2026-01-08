import { describe, expect, it } from "vitest";

import { generateFragmentByFormFragmentFields } from "../generateFragmentByFormFragmentFields.js";

const normalize = (str: string) => str.replace(/\s+/g, " ").trim();
describe("generateFragmentByFormFragmentFields", () => {
    it("should generate the correct fragment for a simple input", () => {
        const input = ["id", "name", "email"];
        const expected = `fragment FooFormFragment on Foo { id name email }`;
        const result = generateFragmentByFormFragmentFields({ formFragmentName: "FooFormFragment", gqlType: "Foo", formFragmentFields: input });
        expect(normalize(result)).toBe(expected);
    });
    it("should generate the correct fragment for a input with nested fields", () => {
        const input = ["id", "name", "user.name", "user.id"];
        const expected = `fragment FooFormFragment on Foo { id name user { name id } }`;
        const result = generateFragmentByFormFragmentFields({ formFragmentName: "FooFormFragment", gqlType: "Foo", formFragmentFields: input });
        expect(normalize(result)).toBe(expected);
    });
    it("should generate the correct fragment for a input with upload fragment for file upload", () => {
        const input = ["id", "name", "upload...FinalFormFileUploadDownloadable"];
        const expected = `fragment FooFormFragment on Foo { id name upload { ...FinalFormFileUploadDownloadable } } \${finalFormFileUploadDownloadableFragment}`;
        const result = generateFragmentByFormFragmentFields({ formFragmentName: "FooFormFragment", gqlType: "Foo", formFragmentFields: input });
        expect(normalize(result)).toBe(expected);
    });
});
