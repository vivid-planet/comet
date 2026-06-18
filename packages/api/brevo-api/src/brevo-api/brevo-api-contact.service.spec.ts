import { Brevo, BrevoError } from "@getbrevo/brevo";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { Test, type TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BREVO_MODULE_CONFIG } from "../config/brevo-module.constants";
import { BrevoApiClientFactory } from "./brevo-api-client.factory";
import { BrevoApiContactsService } from "./brevo-api-contact.service";

const scope = { domain: "main" };

describe("BrevoApiContactsService", () => {
    let service: BrevoApiContactsService;
    const contactsApi = {
        getContactInfo: vi.fn(),
        getContactsFromList: vi.fn(),
        updateContact: vi.fn(),
    };

    beforeEach(async () => {
        vi.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BrevoApiContactsService,
                { provide: BREVO_MODULE_CONFIG, useValue: { brevo: {} } },
                { provide: getRepositoryToken("BrevoConfig"), useValue: {} },
                { provide: BrevoApiClientFactory, useValue: { getClient: () => ({ contacts: contactsApi }) } },
            ],
        }).compile();

        service = module.get(BrevoApiContactsService);
    });

    describe("findContact", () => {
        it("returns the contact when found", async () => {
            const contact = { id: 5, email: "jane@example.com" };
            contactsApi.getContactInfo.mockResolvedValue(contact);

            await expect(service.findContact(5, scope)).resolves.toBe(contact);
            expect(contactsApi.getContactInfo).toHaveBeenCalledWith({ identifier: 5 });
        });

        it("returns null when the contact does not exist (404)", async () => {
            contactsApi.getContactInfo.mockRejectedValue(new Brevo.NotFoundError({ code: "not_found", message: "not found" }));

            await expect(service.findContact(5, scope)).resolves.toBeNull();
        });

        it("returns null when the identifier is invalid (400)", async () => {
            contactsApi.getContactInfo.mockRejectedValue(new Brevo.BadRequestError({ code: "invalid_parameter", message: "bad" }));

            await expect(service.findContact("not-an-email", scope)).resolves.toBeNull();
        });

        it("rethrows other Brevo errors", async () => {
            contactsApi.getContactInfo.mockRejectedValue(new BrevoError({ message: "x", statusCode: 500, body: { message: "Server error" } }));

            await expect(service.findContact(5, scope)).rejects.toThrowError("Server error");
        });
    });

    describe("getContactInfoByEmail", () => {
        it("looks the contact up by email and returns null on 404", async () => {
            contactsApi.getContactInfo.mockRejectedValue(new Brevo.NotFoundError({ code: "not_found", message: "not found" }));

            await expect(service.getContactInfoByEmail("ghost@example.com", scope)).resolves.toBeNull();
            expect(contactsApi.getContactInfo).toHaveBeenCalledWith({ identifier: "ghost@example.com" });
        });
    });

    describe("findContactsByListId", () => {
        it("returns the contacts and count as a tuple", async () => {
            const contacts = [{ id: 1 }, { id: 2 }];
            contactsApi.getContactsFromList.mockResolvedValue({ contacts, count: 2 });

            await expect(service.findContactsByListId(7, 25, 50, scope)).resolves.toEqual([contacts, 2]);
            expect(contactsApi.getContactsFromList).toHaveBeenCalledWith({ listId: 7, limit: 25, offset: 50 });
        });
    });

    describe("updateContact", () => {
        it("sends the update request and returns the refetched contact", async () => {
            const updatedContact = { id: 9, email: "jane@example.com" };
            contactsApi.updateContact.mockResolvedValue(undefined);
            contactsApi.getContactInfo.mockResolvedValue(updatedContact);

            const result = await service.updateContact(9, { blocked: true, listIds: [3] }, scope);

            expect(contactsApi.updateContact).toHaveBeenCalledWith({
                identifier: 9,
                emailBlacklisted: true,
                attributes: undefined,
                listIds: [3],
                unlinkListIds: undefined,
            });
            expect(result).toBe(updatedContact);
        });
    });
});
