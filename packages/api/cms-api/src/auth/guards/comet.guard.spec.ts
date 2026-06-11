import { type ExecutionContext, UnauthorizedException } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CurrentUser } from "../../user-permissions/dto/current-user";
import type { User } from "../../user-permissions/interfaces/user";
import type { UserPermissionsService } from "../../user-permissions/user-permissions.service";
import { DISABLE_COMET_GUARDS_METADATA_KEY } from "../decorators/disable-comet-guards.decorator";
import { type AuthenticateUserResult, type AuthServiceInterface, SKIP_AUTH_SERVICE } from "../util/auth-service.interface";
import { CometAuthGuard } from "./comet.guard";

const user: User = { id: "user-1", name: "Max", email: "max@example.com" };

const createAuthService = (result: AuthenticateUserResult | undefined): AuthServiceInterface => ({
    authenticateUser: vi.fn().mockResolvedValue(result),
});

const createUserPermissionsService = (overrides: Partial<UserPermissionsService> = {}): UserPermissionsService =>
    ({
        getUserService: vi.fn().mockReturnValue(undefined),
        createCurrentUser: vi.fn().mockImplementation(async (authenticatedUser: User) => ({ ...authenticatedUser, permissions: [] }) as CurrentUser),
        ...overrides,
    }) as unknown as UserPermissionsService;

const createHttpExecutionContext = ({ request }: { request: Partial<Request> }): ExecutionContext =>
    ({
        getType: () => "http",
        switchToHttp: () => ({ getRequest: () => request }),
        getHandler: () => function handler() {},
        getClass: () => class TestController {},
    }) as unknown as ExecutionContext;

const createRequest = (headers: Record<string, string> = {}): Partial<Request> => ({ headers }) as Partial<Request>;

const createGuard = ({
    authServices,
    service = createUserPermissionsService(),
    disableCometGuard = false,
}: {
    authServices: AuthServiceInterface[];
    service?: UserPermissionsService;
    disableCometGuard?: boolean;
}) => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(disableCometGuard) } as unknown as Reflector;
    return new CometAuthGuard(reflector, service, authServices);
};

describe("CometAuthGuard", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("guard disabling", () => {
        it("returns true without authenticating when the guard is disabled", async () => {
            const authService = createAuthService(undefined);
            const guard = createGuard({ authServices: [authService], disableCometGuard: true });

            await expect(guard.canActivate(createHttpExecutionContext({ request: createRequest() }))).resolves.toBe(true);
            expect(authService.authenticateUser).not.toHaveBeenCalled();
        });

        it("still authenticates a disabled guard when the x-include-invisible-content header is set", async () => {
            const authService = createAuthService({ user });
            const guard = createGuard({ authServices: [authService], disableCometGuard: true });

            const request = createRequest({ "x-include-invisible-content": "1" });
            await expect(guard.canActivate(createHttpExecutionContext({ request }))).resolves.toBe(true);
            expect(authService.authenticateUser).toHaveBeenCalled();
        });
    });

    describe("authentication", () => {
        it("throws UnauthorizedException when no auth service authenticates the user", async () => {
            const guard = createGuard({ authServices: [createAuthService(undefined)] });

            await expect(guard.canActivate(createHttpExecutionContext({ request: createRequest() }))).rejects.toThrow(UnauthorizedException);
        });

        it("throws UnauthorizedException when an auth service returns an authentication error", async () => {
            const guard = createGuard({ authServices: [createAuthService({ authenticationError: "invalid token" })] });

            await expect(guard.canActivate(createHttpExecutionContext({ request: createRequest() }))).rejects.toThrow("invalid token");
        });

        it("skips auth services returning SKIP_AUTH_SERVICE and uses the first authenticating one", async () => {
            const skippingService = createAuthService(SKIP_AUTH_SERVICE);
            const authenticatingService = createAuthService({ user });
            const neverReachedService = createAuthService({ user });
            const guard = createGuard({ authServices: [skippingService, authenticatingService, neverReachedService] });

            const request = createRequest();
            await expect(guard.canActivate(createHttpExecutionContext({ request }))).resolves.toBe(true);
            expect(skippingService.authenticateUser).toHaveBeenCalled();
            expect(authenticatingService.authenticateUser).toHaveBeenCalled();
            expect(neverReachedService.authenticateUser).not.toHaveBeenCalled();
        });
    });

    describe("system user", () => {
        it("sets the system user on the request", async () => {
            const guard = createGuard({ authServices: [createAuthService({ systemUser: "system" })] });

            const request = createRequest();
            await expect(guard.canActivate(createHttpExecutionContext({ request }))).resolves.toBe(true);
            expect(request).toHaveProperty("user", "system");
        });
    });

    describe("authentication by user", () => {
        it("creates the current user from the returned user and sets it on the request", async () => {
            const service = createUserPermissionsService();
            const guard = createGuard({ authServices: [createAuthService({ user })], service });

            const request = createRequest();
            await expect(guard.canActivate(createHttpExecutionContext({ request }))).resolves.toBe(true);
            expect(service.createCurrentUser).toHaveBeenCalledWith(user, request);
            expect(request).toHaveProperty("user", expect.objectContaining({ id: "user-1", permissions: [] }));
        });
    });

    describe("authentication by userId", () => {
        it("throws UnauthorizedException when no user service is configured", async () => {
            const service = createUserPermissionsService({ getUserService: vi.fn().mockReturnValue(undefined) });
            const guard = createGuard({ authServices: [createAuthService({ userId: "user-1" })], service });

            await expect(guard.canActivate(createHttpExecutionContext({ request: createRequest() }))).rejects.toThrow(UnauthorizedException);
        });

        it("resolves the user via getUser and sets the current user on the request", async () => {
            const getUser = vi.fn().mockResolvedValue(user);
            const service = createUserPermissionsService({ getUserService: vi.fn().mockReturnValue({ getUser }) });
            const guard = createGuard({ authServices: [createAuthService({ userId: "user-1" })], service });

            const request = createRequest();
            await expect(guard.canActivate(createHttpExecutionContext({ request }))).resolves.toBe(true);
            expect(getUser).toHaveBeenCalledWith("user-1");
            expect(service.createCurrentUser).toHaveBeenCalledWith(user, request);
        });

        it("prefers getUserForLogin over getUser when available", async () => {
            const getUser = vi.fn().mockResolvedValue(user);
            const getUserForLogin = vi.fn().mockResolvedValue(user);
            const service = createUserPermissionsService({ getUserService: vi.fn().mockReturnValue({ getUser, getUserForLogin }) });
            const guard = createGuard({ authServices: [createAuthService({ userId: "user-1" })], service });

            await expect(guard.canActivate(createHttpExecutionContext({ request: createRequest() }))).resolves.toBe(true);
            expect(getUserForLogin).toHaveBeenCalledWith("user-1");
            expect(getUser).not.toHaveBeenCalled();
        });

        it("throws UnauthorizedException when the user service fails to resolve the user", async () => {
            const getUser = vi.fn().mockRejectedValue(new Error("not found"));
            const service = createUserPermissionsService({ getUserService: vi.fn().mockReturnValue({ getUser }) });
            const guard = createGuard({ authServices: [createAuthService({ userId: "user-1" })], service });

            await expect(guard.canActivate(createHttpExecutionContext({ request: createRequest() }))).rejects.toThrow("not found");
        });
    });

    describe("GraphQL context", () => {
        const createGraphQLExecutionContext = ({
            request,
            parentTypeName,
        }: {
            request: Partial<Request>;
            parentTypeName: string;
        }): ExecutionContext => {
            const context = {
                getType: () => "graphql",
                getHandler: () => function handler() {},
                getClass: () => class TestResolver {},
            } as unknown as ExecutionContext;

            vi.spyOn(GqlExecutionContext, "create").mockReturnValue({
                getContext: () => ({ req: request }),
                getInfo: () => ({ parentType: { name: parentTypeName } }),
            } as unknown as GqlExecutionContext);

            return context;
        };

        it("returns true without authenticating when resolving a non-root GraphQL field", async () => {
            const authService = createAuthService(undefined);
            const guard = createGuard({ authServices: [authService] });

            const context = createGraphQLExecutionContext({ request: createRequest(), parentTypeName: "SomeType" });
            await expect(guard.canActivate(context)).resolves.toBe(true);
            expect(authService.authenticateUser).not.toHaveBeenCalled();
        });

        it("authenticates and reads the request from the GraphQL context for root queries", async () => {
            const request = createRequest();
            const guard = createGuard({ authServices: [createAuthService({ systemUser: "system" })] });

            const context = createGraphQLExecutionContext({ request, parentTypeName: "Query" });
            await expect(guard.canActivate(context)).resolves.toBe(true);
            expect(request).toHaveProperty("user", "system");
        });
    });

    it("checks both the handler and the class for the disable-guard metadata", async () => {
        const reflector = { getAllAndOverride: vi.fn().mockReturnValue(true) } as unknown as Reflector;
        const guard = new CometAuthGuard(reflector, createUserPermissionsService(), [createAuthService(undefined)]);

        await guard.canActivate(createHttpExecutionContext({ request: createRequest() }));
        expect(reflector.getAllAndOverride).toHaveBeenCalledWith(DISABLE_COMET_GUARDS_METADATA_KEY, [expect.any(Function), expect.any(Function)]);
    });
});
