import { messages } from "@comet/admin";
import { render } from "@testing-library/react";

import { ContentScopeIndicator } from "./ContentScopeIndicator";
import { ContentScopeValues, useContentScope, UseContentScopeApi } from "./Provider";

jest.mock("react-intl", () => ({
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => {
        return defaultMessage;
    },
}));

// jest.mock("@mui/material", () => ({
//     ...jest.requireActual("@mui/material"),
//     useTheme: () => ({ palette: { primary: { dark: "dark" }, grey: { A100: "A100" } } }),
// }));

jest.mock("@comet/admin-icons", () => ({
    Domain: () => null,
}));

jest.mock("@comet/admin", () => ({
    messages: {
        globalContentScope: { defaultMessage: "" },
    },
}));

jest.mock("./Provider", () => ({
    useContentScope: jest.fn(),
}));

const cometWebsiteScope = {
    scope: {
        domain: "comet-dxp.com",
        language: "en",
    },
    values: [
        {
            domain: { value: "comet-dxp.com", label: "COMET DXP" },
            language: { value: "en", label: "English" },
        },
        {
            domain: { value: "comet-dxp.com", label: "COMET DXP" },
            language: { value: "de", label: "German" },
        },
        {
            domain: { value: "comet-dxp.com", label: "COMET DXP" },
            language: { value: "ch" },
        },
    ],
};

const scopeWithOptionalParts = {
    scope: {
        organization: "organization-1",
    },
    values: [
        {
            organization: { value: "organization-1", label: "Organization 1" },
        },
        {
            company: { value: "company-1", label: "Company 1" },
        },
    ] as ContentScopeValues<{ organization?: string; company?: string }>,
};

function mockUseContentScope(scopeApi: Pick<UseContentScopeApi, "scope" | "values">) {
    (useContentScope as jest.Mock).mockReturnValue(scopeApi);
}

const globalMessage = "Global";

describe("ContentScopeIndicator", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseContentScope(cometWebsiteScope);
    });

    it("displays the current content scope by default", () => {
        const { container } = render(<ContentScopeIndicator />);

        expect(container.innerHTML).toContain("COMET DXP / English");
    });

    it("displays the passed scope instead of the default content scope if a scope is passed", () => {
        const { container } = render(<ContentScopeIndicator scope={{ domain: "comet-dxp.com", language: "de" }} />);

        expect(container.innerHTML).toContain("COMET DXP / German");
        expect(container.innerHTML).not.toContain("English");
    });

    it("displays 'Global' if global is true", () => {
        messages.globalContentScope.defaultMessage = globalMessage;
        const { container } = render(<ContentScopeIndicator global />);

        expect(container.innerHTML).toContain(globalMessage);
    });

    it("displays the capitalized scope value if it has no associated label", () => {
        const { container } = render(<ContentScopeIndicator scope={{ language: "ch" }} />);

        expect(container.innerHTML).toContain("Ch");
    });

    it("displays only a part of the scope if only one part is passed", () => {
        const { container } = render(<ContentScopeIndicator scope={{ language: "de" }} />);

        expect(container.innerHTML).toContain("German");
        expect(container.innerHTML).not.toContain("COMET DXP");
    });

    it("displays only the available scope part if one part is undefined", () => {
        mockUseContentScope(scopeWithOptionalParts);
        const { container } = render(<ContentScopeIndicator scope={{ organization: "organization-1", company: undefined }} />);

        expect(container.innerHTML).toContain("Organization 1");
        expect(container.innerHTML).not.toContain("Organization 1 /");
        expect(container.innerHTML).not.toContain("/ Organization 1");
    });
});
