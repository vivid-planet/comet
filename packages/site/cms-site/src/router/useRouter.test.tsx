import { renderHook } from "@testing-library/react-hooks";

import { Url } from "../preview/PreviewContext";
import { useRouter } from "./useRouter";

const push = jest.fn();
const replace = jest.fn();

jest.mock("next/router", () => ({
    useRouter: () => ({
        push,
        replace,
    }),
}));

jest.mock("../preview/usePreview", () => ({
    usePreview: () => ({
        previewPathToPath: jest.fn(),
        pathToPreviewPath: (url: Url) => `/preview${url}`,
    }),
}));

describe("useRouter", () => {
    it("push", () => {
        const { result } = renderHook(() => useRouter());
        result.current.push("/test");

        expect(push).toBeCalledWith("/preview/test", undefined, undefined);
    });

    it("replace", () => {
        const { result } = renderHook(() => useRouter());
        result.current.replace("/test");

        expect(replace).toBeCalledWith("/preview/test", undefined, undefined);
    });
});
