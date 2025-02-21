import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { createJwtAuthService, type JwtAuthServiceOptions } from "./jwt.auth-service";

describe("createJwtAuthService", () => {
    const instantianteService = (options: JwtAuthServiceOptions) => new (createJwtAuthService(options))(new JwtService());
    const mockRequest = (authorizationHeader: string) =>
        jest.fn().mockReturnValue({ header: jest.fn().mockImplementation(() => authorizationHeader) })();

    // Default token from jwt.io:
    // {
    //     "sub": "1234567890",
    //     "name": "John Doe",
    //     "iat": 1516239022
    // }
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o";

    it("returns undefined on unknown header", async () => {
        const service = instantianteService({});
        expect(await service.authenticateUser(mockRequest(""))).toBeUndefined();
        expect(await service.authenticateUser(mockRequest("xxx"))).toBeUndefined();
        expect(await service.authenticateUser(mockRequest("Bearer"))).toBeUndefined();
    });

    it("throws Error on missing secret password", async () => {
        const service = instantianteService({});
        await expect(() => service.authenticateUser(mockRequest(`Bearer ${token}`))).rejects.toThrow("secret or public key must be provided");
    });

    it("throws UnauthorizedException on malformed JWT", async () => {
        const service = instantianteService({ verifyOptions: { secret: "secret" } });
        await expect(() => service.authenticateUser(mockRequest(`Bearer XXX`))).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException on wrong secret", async () => {
        const service = instantianteService({ verifyOptions: { secret: "wrong secret" } });
        await expect(() => service.authenticateUser(mockRequest(`Bearer ${token}`))).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException on expired jwt", async () => {
        const expiredToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.dK_h9vUldnsPtDnTil_YuzaPZT-vMODIfX_nyXDADVE";
        const service = instantianteService({ verifyOptions: { secret: "secret" } });
        await expect(() => service.authenticateUser(mockRequest(`Bearer ${expiredToken}`))).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException on missing sub", async () => {
        const tokenWithoutSub =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.8nYFUX869Y1mnDDDU4yL11aANgVRuifoxrE8BHZY1iE";
        const service = instantianteService({ verifyOptions: { secret: "secret" } });
        await expect(() => service.authenticateUser(mockRequest(`Bearer ${tokenWithoutSub}`))).rejects.toThrow(UnauthorizedException);
    });

    it("verifies token", async () => {
        const service = instantianteService({ verifyOptions: { secret: "secret" } });
        expect(await service.authenticateUser(mockRequest(`Bearer ${token}`))).toBe("1234567890");
    });

    it("verifies token and returns user", async () => {
        const service = instantianteService({
            verifyOptions: { secret: "secret" },
            convertJwtToUser: (jwt) => ({ id: jwt.sub, name: jwt.name, email: "test@comet-dxp.com" }),
        });
        expect(await service.authenticateUser(mockRequest(`Bearer ${token}`))).toStrictEqual({
            id: "1234567890",
            name: "John Doe",
            email: "test@comet-dxp.com",
        });
    });
});
