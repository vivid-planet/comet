import type { PropsWithChildren } from "react";
import { render } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { type CometConfig, CometConfigProvider } from "./CometConfigContext";

describe("CometConfigProvider", () => {
    afterEach(() => {
        document.title = "";
    });

    function TestConfigProvider({
        children,
        config,
    }: PropsWithChildren<{
        config?: Partial<CometConfig>;
    }>) {
        return (
            <CometConfigProvider apiUrl="http://api.test" graphQLApiUrl="http://api.test/graphql" adminUrl="http://admin.test" {...config}>
                {children}
            </CometConfigProvider>
        );
    }

    it("should append the optional environment label to the browser tab title", () => {
        document.title = "Comet Demo Admin";

        const { unmount } = render(
            <TestConfigProvider config={{ environmentLabel: "Staging" }}>
                <div />
            </TestConfigProvider>,
        );

        expect(document.title).toBe("Comet Demo Admin [Staging]");

        unmount();

        expect(document.title).toBe("Comet Demo Admin");
    });

    it("should keep the browser tab title unchanged if no environment label is configured", () => {
        document.title = "Comet Demo Admin";

        render(
            <TestConfigProvider>
                <div />
            </TestConfigProvider>,
        );

        expect(document.title).toBe("Comet Demo Admin");
    });
});
