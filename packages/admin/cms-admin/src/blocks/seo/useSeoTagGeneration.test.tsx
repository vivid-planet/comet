import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useErrorDialog } from "@comet/admin";
import { act, renderHook } from "@testing-library/react-hooks";

import { useDocumentContentGenerationApi } from "../../documents/DocumentContentGenerationContext";
import { _resetSeoTagsCache, useSeoTagGeneration } from "./useSeoTagGeneration";

jest.mock("../../documents/DocumentContentGenerationContext", () => {
    return {
        useDocumentContentGenerationApi: jest.fn(),
    };
});
jest.mock("@comet/admin", () => {
    return {
        useErrorDialog: jest.fn(),
    };
});

const mockDocumentContentGenerationApi = {
    seoBlock: {
        getDocumentContent: jest.fn(),
    },
};

const mockErrorDialog = {
    showError: jest.fn(),
};

const mockApolloClient = new ApolloClient({
    cache: new InMemoryCache(),
});

jest.mock("@apollo/client", () => {
    const originalModule = jest.requireActual("@apollo/client");
    return {
        ...originalModule,
        useApolloClient: () => mockApolloClient,
    };
});

describe("useSeoTagGeneration", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.resetAllMocks();
        (useDocumentContentGenerationApi as jest.Mock).mockReturnValue(mockDocumentContentGenerationApi);
        (useErrorDialog as jest.Mock).mockReturnValue(mockErrorDialog);
        _resetSeoTagsCache();
    });

    it("shows error when no content is available", async () => {
        mockDocumentContentGenerationApi.seoBlock.getDocumentContent.mockReturnValue([]);

        const { result } = renderHook(() => useSeoTagGeneration());

        await act(async () => {
            await expect(result.current("htmlTitle", undefined)).rejects.toThrow("No content to generate SEO tags from");
            expect(mockErrorDialog.showError).toHaveBeenCalled();
        });
    });

    it("returns fetched SEO tags if no cached values or pending requests are available", async () => {
        const content = "test content";
        const seoTags = {
            htmlTitle: "Test Title",
            metaDescription: "Test Description",
            openGraphTitle: "Test OG Title",
            openGraphDescription: "Test OG Description",
        };

        mockDocumentContentGenerationApi.seoBlock.getDocumentContent.mockReturnValue([content]);
        mockApolloClient.mutate = jest.fn().mockResolvedValue({
            data: {
                generateSeoTags: seoTags,
            },
        });

        const { result } = renderHook(() => useSeoTagGeneration());

        await act(async () => {
            const generatedTag = await result.current("htmlTitle", undefined);
            expect(generatedTag).toBe(seoTags.htmlTitle);
        });
    });

    it("returns cached SEO tag if content has not changed", async () => {
        const content = "test content";
        const seoTags = {
            htmlTitle: "Test Title",
            metaDescription: "Test Description",
            openGraphTitle: "Test OG Title",
            openGraphDescription: "Test OG Description",
        };

        mockDocumentContentGenerationApi.seoBlock.getDocumentContent.mockReturnValue([content]);
        mockApolloClient.mutate = jest.fn().mockResolvedValue({
            data: {
                generateSeoTags: seoTags,
            },
        });

        const { result } = renderHook(() => useSeoTagGeneration());

        await act(async () => {
            const generatedTag = await result.current("htmlTitle", undefined);
            expect(generatedTag).toBe(seoTags.htmlTitle);
            expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);

            const cachedTag = await result.current("htmlTitle", undefined);
            expect(cachedTag).toBe(seoTags.htmlTitle);
            expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);
        });

        jest.resetModules();
    });

    it("handles pending request correctly", async () => {
        const content = "test content";
        const seoTags = {
            htmlTitle: "Test Title",
            metaDescription: "Test Description",
            openGraphTitle: "Test OG Title",
            openGraphDescription: "Test OG Description",
        };

        mockDocumentContentGenerationApi.seoBlock.getDocumentContent.mockReturnValue([content]);
        mockApolloClient.mutate = jest.fn().mockResolvedValue({
            data: {
                generateSeoTags: seoTags,
            },
        });

        const { result } = renderHook(() => useSeoTagGeneration());

        await act(async () => {
            const request1 = result.current("htmlTitle", undefined);
            const request2 = result.current("metaDescription", undefined);

            // since only one response is mocked, both requests must use the same response
            const generatedTag1 = await request1;
            const generatedTag2 = await request2;

            expect(generatedTag1).toBe(seoTags.htmlTitle);
            expect(generatedTag2).toBe(seoTags.metaDescription);
            expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);
        });
    });
});
