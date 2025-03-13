import { Test, type TestingModule } from "@nestjs/testing";

import { AbstractAccessControlService } from "./access-control.service";
import { type CurrentUser } from "./dto/current-user";

describe("AbstractAccessControlService", () => {
    class ConcreteAccessControlService extends AbstractAccessControlService {}

    let service: ConcreteAccessControlService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConcreteAccessControlService],
        }).compile();

        service = module.get<ConcreteAccessControlService>(ConcreteAccessControlService);
    });

    describe("isAllowed", () => {
        it("should treat null and undefined scope dimensions the same", () => {
            const user: CurrentUser = {
                id: "b26d86a7-32bb-4c84-ab9d-d167dddd40ff",
                name: "User",
                email: "user@example.com",
                permissions: [{ permission: "pageTree", contentScopes: [{ domain: "main", language: null }] }],
            };

            expect(service.isAllowed(user, "pageTree", { domain: "main" })).toBe(true);

            expect(service.isAllowed(user, "pageTree", { domain: "main", language: null })).toBe(true);

            expect(service.isAllowed(user, "pageTree", { domain: "main", language: undefined })).toBe(true);
        });
    });
});
