import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useErrorDialog } from "@comet/admin";
import { act, renderHook } from "test-utils";

import { useContentGenerationConfig } from "../../documents/ContentGenerationConfigContext";
import { useSeoTagGeneration } from "./useSeoTagGeneration";

jest.mock("../../documents/ContentGenerationConfigContext", () => {
    return {
        useContentGenerationConfig: jest.fn(),
    };
});

jest.mock("../../contentScope/Provider", () => {
    return {
        useContentScope: jest.fn(),
    };
});

jest.mock("../../contentLanguage/useContentLanguage", () => {
    return {
        useContentLanguage: jest.fn(),
    };
});

jest.mock("@comet/admin", () => {
    return {
        useErrorDialog: jest.fn(),
    };
});

const mockContentGenerationConfig = {
    seo: {
        getRelevantContent: jest.fn(),
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
        (useContentGenerationConfig as jest.Mock).mockReturnValue(mockContentGenerationConfig);
        (useErrorDialog as jest.Mock).mockReturnValue(mockErrorDialog);
    });

    it("shows error when no content is available", async () => {
        mockContentGenerationConfig.seo.getRelevantContent.mockReturnValue([]);

        const { result } = renderHook(() => useSeoTagGeneration());

        await act(async () => {
            expect(await result.current("htmlTitle", undefined)).toEqual("");
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

        mockContentGenerationConfig.seo.getRelevantContent.mockReturnValue([content]);
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

        mockContentGenerationConfig.seo.getRelevantContent.mockReturnValue([content]);
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

        mockContentGenerationConfig.seo.getRelevantContent.mockReturnValue([content]);
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
