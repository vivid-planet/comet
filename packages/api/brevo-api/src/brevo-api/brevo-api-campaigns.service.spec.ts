import { Brevo } from "@getbrevo/brevo";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Test, type TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { EmailCampaignInterface } from "../email-campaign/entities/email-campaign-entity.factory";
import { SendingState } from "../email-campaign/sending-state.enum";
import { BrevoApiCampaignsService } from "./brevo-api-campaigns.service";
import { BrevoApiClientFactory } from "./brevo-api-client.factory";
import type { BrevoApiCampaign } from "./dto/brevo-api-campaign";

const scope = { domain: "main" };

function campaignWithStatus(status: Brevo.GetEmailCampaignResponse.Status): BrevoApiCampaign {
    return { status } as unknown as BrevoApiCampaign;
}

describe("BrevoApiCampaignsService", () => {
    let service: BrevoApiCampaignsService;
    const emailCampaigns = {
        createEmailCampaign: vi.fn(),
    };

    beforeEach(async () => {
        vi.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BrevoApiCampaignsService,
                { provide: BrevoApiClientFactory, useValue: { getClient: () => ({ emailCampaigns }) } },
                { provide: CACHE_MANAGER, useValue: {} },
            ],
        }).compile();

        service = module.get(BrevoApiCampaignsService);
    });

    describe("getSendingInformationFromBrevoCampaign", () => {
        it("maps the Brevo campaign status to the sending state", () => {
            expect(service.getSendingInformationFromBrevoCampaign(campaignWithStatus(Brevo.GetEmailCampaignResponse.Status.Sent))).toBe(
                SendingState.SENT,
            );
            expect(service.getSendingInformationFromBrevoCampaign(campaignWithStatus(Brevo.GetEmailCampaignResponse.Status.Queued))).toBe(
                SendingState.SCHEDULED,
            );
            expect(service.getSendingInformationFromBrevoCampaign(campaignWithStatus(Brevo.GetEmailCampaignResponse.Status.InProcess))).toBe(
                SendingState.SCHEDULED,
            );
            expect(service.getSendingInformationFromBrevoCampaign(campaignWithStatus(Brevo.GetEmailCampaignResponse.Status.Draft))).toBe(
                SendingState.DRAFT,
            );
        });
    });

    describe("createBrevoCampaign", () => {
        it("creates the campaign with the mapped fields and returns its id", async () => {
            emailCampaigns.createEmailCampaign.mockResolvedValue({ id: 42 });
            const campaign = {
                title: "Newsletter",
                subject: "Hello",
                scope,
                targetGroups: { loadItems: vi.fn().mockResolvedValue([{ brevoId: 10 }, { brevoId: 11 }]) },
            } as unknown as EmailCampaignInterface;

            const id = await service.createBrevoCampaign({ campaign, htmlContent: "<p>Hi</p>", sender: { name: "Sender", mail: "s@example.com" } });

            expect(id).toBe(42);
            expect(emailCampaigns.createEmailCampaign).toHaveBeenCalledWith({
                name: "Newsletter",
                subject: "Hello",
                sender: { name: "Sender", email: "s@example.com" },
                recipients: { listIds: [10, 11] },
                htmlContent: "<p>Hi</p>",
                scheduledAt: undefined,
                unsubscriptionPageId: undefined,
            });
        });
    });
});
