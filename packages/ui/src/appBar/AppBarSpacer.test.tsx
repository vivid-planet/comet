import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppBarSpacer } from "./AppBarSpacer";

describe("AppBarSpacer", () => {
    it("renders an empty element with the styling contract and the consumer's class and style", () => {
        const { container } = render(<AppBarSpacer className="consumer" style={{ minWidth: "1rem" }} />);

        const spacer = container.firstElementChild;
        expect(spacer).toHaveClass("dextinityAppBarSpacer", "consumer");
        expect(spacer).toHaveStyle({ minWidth: "1rem" });
        expect(spacer).toBeEmptyDOMElement();
    });
});
