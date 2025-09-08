import { generateGridToolbar } from "../generateGridToolbar";

describe("generateGridToolbar", () => {
    it("generates toolbar with all features enabled", () => {
        const output = generateGridToolbar({
            componentName: "BooksGridToolbar",
            forwardToolbarAction: true,
            hasSearch: true,
            hasFilter: true,
            excelExport: true,
            allowAdding: true,
            instanceGqlType: "booksMessages",
            gqlType: "Book",
            newEntryText: undefined,
            fragmentName: "bookFragment",
        });

        expect(output).toMatchSnapshot();
    });

    it("generates toolbar with minimal features", () => {
        const output = generateGridToolbar({
            componentName: "BooksGridToolbar",
            forwardToolbarAction: false,
            hasSearch: false,
            hasFilter: false,
            excelExport: false,
            allowAdding: true,
            instanceGqlType: "booksMessages",
            gqlType: "Book",
            newEntryText: undefined,
            fragmentName: "bookFragment",
        });

        expect(output).toMatchSnapshot();
    });

    it("generates toolbar with custom newEntryText", () => {
        const output = generateGridToolbar({
            componentName: "BooksGridToolbar",
            forwardToolbarAction: false,
            hasSearch: false,
            hasFilter: false,
            excelExport: false,
            allowAdding: true,
            instanceGqlType: "booksMessages",
            gqlType: "Book",
            newEntryText: "Create new book",
            fragmentName: "bookFragment",
        });

        expect(output).toMatchSnapshot();
    });

    it("generates empty toolbar when no features are enabled", () => {
        const output = generateGridToolbar({
            componentName: "BooksGridToolbar",
            forwardToolbarAction: false,
            hasSearch: false,
            hasFilter: false,
            excelExport: false,
            allowAdding: false,
            instanceGqlType: "booksMessages",
            gqlType: "Book",
            newEntryText: undefined,
            fragmentName: "bookFragment",
        });

        expect(output).toMatchSnapshot();
    });

    it("generates valid Toolbar props for only excelExport enabled", () => {
        const output = generateGridToolbar({
            componentName: "BooksGridToolbar",
            forwardToolbarAction: false,
            hasSearch: false,
            hasFilter: false,
            excelExport: true,
            allowAdding: false,
            instanceGqlType: "booksMessages",
            gqlType: "Book",
            newEntryText: undefined,
            fragmentName: "bookFragment",
        });

        expect(output).toMatchSnapshot();
    });
});
