import { foo } from "./foo";

describe("foo", () => {
    it('should log "foo"', () => {
        const logSpy = jest.spyOn(console, "log");
        foo();
        expect(logSpy).toHaveBeenCalledWith("foo");
    });
});
