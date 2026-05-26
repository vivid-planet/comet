import { expect, test } from "vitest";

// Intentionally failing test to verify the vitest github-actions reporter
// emits ::error:: annotations in CI. Remove after verifying PR #5703.
test("github-actions reporter integration: this test fails on purpose", () => {
    expect(1 + 1).toBe(3);
});
