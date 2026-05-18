import { cleanup, render, screen } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { CometConfigProvider } from "../../../config/CometConfigContext";
import { AboutModal } from "./AboutModal";

describe("AboutModal", () => {
    afterEach(() => {
        cleanup();
    });

    function renderAboutModal(environmentLabel?: string) {
        return render(
            <CometConfigProvider
                apiUrl="http://api.test"
                graphQLApiUrl="http://api.test/graphql"
                adminUrl="http://admin.test"
                environmentLabel={environmentLabel}
            >
                <AboutModal open />
            </CometConfigProvider>,
        );
    }

    it("should show the environment label when configured", () => {
        renderAboutModal("Staging");

        expect(screen.getByText("Environment: Staging")).toBeTruthy();
    });

    it("should hide the environment label when not configured", () => {
        renderAboutModal();

        expect(screen.queryByText(/^Environment:/)).toBeNull();
    });
});
