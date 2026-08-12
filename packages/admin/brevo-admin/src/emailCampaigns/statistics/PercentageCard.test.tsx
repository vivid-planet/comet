import { cleanup, render, screen } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { afterEach, describe, expect, it } from "vitest";

import { PercentageCard } from "./PercentageCard";

function TestWrapper({ children }: { children?: ReactNode }) {
    return (
        <IntlProvider locale="en" messages={{}}>
            {children}
        </IntlProvider>
    );
}

function renderPercentageCard(ui: ReactElement) {
    return render(ui, { wrapper: TestWrapper });
}

describe("PercentageCard", () => {
    afterEach(cleanup);

    it("renders the share of the current number in the target number", () => {
        renderPercentageCard(<PercentageCard title="Opened" currentNumber={25} targetNumber={200} />);

        expect(screen.getByText("12.5%")).toBeDefined();
        expect(screen.getByText("25 / 200")).toBeDefined();
    });

    it("rounds the percentage to three significant digits", () => {
        renderPercentageCard(<PercentageCard title="Opened" currentNumber={1} targetNumber={3} />);

        expect(screen.getByText("33.3%")).toBeDefined();
    });

    it("renders a dash instead of a percentage when the target number is zero", () => {
        renderPercentageCard(<PercentageCard title="Opened" currentNumber={0} targetNumber={0} />);

        expect(screen.getByText("–")).toBeDefined();
    });

    it("renders skeletons while the numbers are unknown", () => {
        const { container } = renderPercentageCard(<PercentageCard title="Opened" />);

        expect(container.querySelectorAll(".MuiSkeleton-root")).toHaveLength(2);
        expect(screen.queryByText("–")).toBeNull();
    });

    it("renders the numbers for the circle variant as well", () => {
        renderPercentageCard(<PercentageCard title="Clicked" currentNumber={150} targetNumber={200} variant="circle" />);

        expect(screen.getByText("75.0%")).toBeDefined();
        expect(screen.getByText("Clicked")).toBeDefined();
    });
});
