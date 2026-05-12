import { FormattedMessage } from "react-intl";
import { describe, expect, it } from "vitest";

import { generateFormattedMessage } from "../intl";

describe("generateFormattedMessage", () => {
    describe("jsx type", () => {
        it("generates JSX with string config", () => {
            const result = generateFormattedMessage({
                id: "test.message",
                config: "Simple message",
                type: "jsx",
            });

            expect(result).toBe('<FormattedMessage id="test.message" defaultMessage="Simple message" />');
        });

        it("generates JSX with default message", () => {
            const result = generateFormattedMessage({
                id: "test.message",
                config: undefined,
                defaultMessage: "Default message",
                type: "jsx",
            });

            expect(result).toBe('<FormattedMessage id="test.message" defaultMessage="Default message" />');
        });

        it("generates JSX with FormattedMessage config object", () => {
            const result = generateFormattedMessage({
                id: "test.message",
                config: <FormattedMessage id="custom.id" defaultMessage="Custom default message" />,
                type: "jsx",
            });

            expect(result).toBe('<FormattedMessage id="custom.id" defaultMessage="Custom default message" />');
        });

        it("generates JSX with FormattedMessage config object overriding defaultMessage", () => {
            const result = generateFormattedMessage({
                id: "test.message",
                config: <FormattedMessage id="custom.id" defaultMessage="Config message" />,
                defaultMessage: "Fallback message",
                type: "jsx",
            });

            expect(result).toBe('<FormattedMessage id="custom.id" defaultMessage="Config message" />');
        });
    });

    describe("intlCall type", () => {
        it("generates intl.formatMessage call with string config", () => {
            const result = generateFormattedMessage({
                id: "test.message",
                config: "Simple message",
                type: "intlCall",
            });

            expect(result).toBe('intl.formatMessage({ id: "test.message", defaultMessage: "Simple message" })');
        });
    });
});
