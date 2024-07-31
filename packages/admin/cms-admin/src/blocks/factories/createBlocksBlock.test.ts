import { BlockInterface, createBlockSkeleton } from "@comet/blocks-admin";

import { filterSupportedBlocks } from "./createBlocksBlock";

jest.mock("react-dnd", () => {
    return;
});

const unscopedBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "Unscoped",
    defaultValues: () => ({}),
};

const domainScopedBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "DomainScoped",
    defaultValues: () => ({}),
    scope: { domain: "main" },
};

const languageScopedBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "LanguageScoped",
    defaultValues: () => ({}),
    scope: [{ language: "en" }],
};

const domainAndLanguageScopedBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "DomainAndLanguageScoped",
    defaultValues: () => ({}),
    scope: { domain: "main", language: "de" },
};

const supportedBlocks = {
    unscoped: unscopedBlock,
    domainScoped: domainScopedBlock,
    languageScoped: languageScopedBlock,
    domainAndLanguageScoped: domainAndLanguageScopedBlock,
};

describe("createBlocksBlock", () => {
    describe("filterSupportedBlocks", () => {
        it("should filter by partial scope", () => {
            expect(filterSupportedBlocks(supportedBlocks, { domain: "main", language: "en" })).toEqual({
                unscoped: unscopedBlock,
                domainScoped: domainScopedBlock,
                languageScoped: languageScopedBlock,
            });

            expect(filterSupportedBlocks(supportedBlocks, { domain: "secondary", language: "en" })).toEqual({
                unscoped: unscopedBlock,
                languageScoped: languageScopedBlock,
            });
        });

        it("should filter by full scope", () => {
            expect(filterSupportedBlocks(supportedBlocks, { domain: "main", language: "de" })).toEqual({
                unscoped: unscopedBlock,
                domainScoped: domainScopedBlock,
                domainAndLanguageScoped: domainAndLanguageScopedBlock,
            });
        });
    });
});
