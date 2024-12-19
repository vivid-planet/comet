import { UnauthorizedException } from "@nestjs/common";

import { createBasicAuthService } from "./basic.auth-service";

describe("createBasicAuthService", () => {
    const createService = (username: string, password: string) => createBasicAuthService({ username, password });
    const instantianteService = (username: string, password: string) => new (createBasicAuthService({ username, password }))();
    const mockRequest = (authorizationHeader: string) =>
        jest.fn().mockReturnValue({ header: jest.fn().mockImplementation(() => authorizationHeader) })();

    it("throws error on wrong configuration", async () => {
        expect(() => createService("vivid", "")).toThrowError();
        expect(() => createService("", "planet")).toThrowError();
        expect(() => createService("", "")).toThrowError();
    });

    it("returns undefined on unknown header", async () => {
        const service = instantianteService("vivid", "planet");
        expect(service.authenticateUser(mockRequest("Bearer"))).toBeUndefined();
        expect(service.authenticateUser(mockRequest("Bearer xxx"))).toBeUndefined();
        expect(service.authenticateUser(mockRequest("BasicAuth xxx"))).toBeUndefined();
        expect(service.authenticateUser(mockRequest(""))).toBeUndefined();
    });

    it("returns undefined on non decodable payload", async () => {
        const service = instantianteService("vivid", "planet");
        expect(service.authenticateUser(mockRequest("Basic #"))).toBeUndefined();
    });

    it("returns undefined on wrong username", async () => {
        const service = instantianteService("vivid", "planet");
        expect(service.authenticateUser(mockRequest(`Basic ${btoa("vivit:planet")}`))).toBeUndefined();
        expect(service.authenticateUser(mockRequest(`Basic ${btoa("vivit:planed")}`))).toBeUndefined();
    });

    it("throws UnauthorizedException on wrong password", async () => {
        const service = instantianteService("vivid", "planet");
        expect(() => service.authenticateUser(mockRequest(`Basic ${btoa("vivid:foo")}`))).toThrow(UnauthorizedException);
        expect(() => service.authenticateUser(mockRequest(`Basic ${btoa("vivid::")}`))).toThrow(UnauthorizedException);
        expect(() => service.authenticateUser(mockRequest(`Basic ${btoa("vivid")}`))).toThrow(UnauthorizedException);
        expect(() => service.authenticateUser(mockRequest(`Basic ${btoa("vivid:planetfoo")}`))).toThrow(UnauthorizedException);
    });

    it("returns username on correct authentication", async () => {
        const service = instantianteService("vivid", "planet");
        expect(service.authenticateUser(mockRequest(`Basic ${btoa("vivid:planet")}`))).toBe("vivid");
    });
});
