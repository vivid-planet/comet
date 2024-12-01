import { render } from "@testing-library/react";
import { ReactChildren } from "react";

import { DamScopeProvider } from "./DamScopeProvider";
import { useDamConfig } from "./useDamConfig";

let mockProviderProps: object = {};

jest.mock("./DamScopeContext", () => {
    const actualContext = jest.requireActual("./DamScopeContext");
    return {
        ...actualContext,
        DamScopeContext: {
            ...actualContext.DamScopeContext,
            Provider: ({ children, ...props }: { children: ReactChildren }) => {
                mockProviderProps = props; // Capture props
                return children; // Properly return React children
            },
        },
    };
});

jest.mock("../../contentScope/Provider", () => ({
    useContentScope: () => ({
        scope: {
            domain: "comet-dxp.com",
            language: "en",
        },
    }),
}));

jest.mock("./useDamConfig", () => ({
    useDamConfig: jest.fn(),
}));

describe("DamScopeProvider", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockProviderProps = {}; // Clear the props before each test
    });

    it("extracts the given scope part from the content scope", () => {
        (useDamConfig as jest.Mock).mockReturnValue({ scopeParts: ["domain"] });

        render(
            <DamScopeProvider>
                <div />
            </DamScopeProvider>,
        );

        expect(mockProviderProps).toStrictEqual({ value: { domain: "comet-dxp.com" } });
    });

    it("ignores non-existing scope parts", () => {
        (useDamConfig as jest.Mock).mockReturnValue({ scopeParts: ["domain", "non-existing"] });

        render(
            <DamScopeProvider>
                <div />
            </DamScopeProvider>,
        );

        expect(mockProviderProps).toStrictEqual({ value: { domain: "comet-dxp.com" } });
    });
});
