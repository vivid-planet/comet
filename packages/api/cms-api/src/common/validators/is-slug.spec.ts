import { IsSlugConstraint } from "./is-slug";

describe("IsSlug", () => {
    describe("findAll", () => {
        it("should accept a valid slug", async () => {
            const validator = new IsSlugConstraint();
            expect(await validator.validate("comet")).toBe(true);
        });
        it("should not accept space", async () => {
            const validator = new IsSlugConstraint();
            expect(await validator.validate("com et")).toBe(false);
        });
        it("should not accept umlaut", async () => {
            const validator = new IsSlugConstraint();
            expect(await validator.validate("comät")).toBe(false);
        });
        it("should not allow url encoded characters", async () => {
            const validator = new IsSlugConstraint();
            expect(await validator.validate("slug%2F2")).toBeFalsy();
        });
    });
});
