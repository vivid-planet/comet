import * as Brevo from "@getbrevo/brevo";
import { Inject, Injectable } from "@nestjs/common";
import { EmailCampaignScopeInterface } from "src/types";

import { BrevoModuleConfig } from "../config/brevo-module.config";
import { BREVO_MODULE_CONFIG } from "../config/brevo-module.constants";
import { BrevoApiSender } from "./dto/brevo-api-sender";

@Injectable()
export class BrevoApiSenderService {
    private readonly senderApi: Brevo.SendersApi;

    constructor(@Inject(BREVO_MODULE_CONFIG) private readonly config: BrevoModuleConfig) {
        this.senderApi = new Brevo.SendersApi();
    }

    public async getSenders(scope: EmailCampaignScopeInterface): Promise<Array<Brevo.GetSendersListSendersInner> | undefined> {
        const apiKey = this.config.brevo.resolveConfig(scope).apiKey;
        this.senderApi.setApiKey(Brevo.SendersApiApiKeys.apiKey, apiKey);

        const { response, body } = await this.senderApi.getSenders();

        if (response.statusCode !== 200) {
            throw new Error("Failed to get senders");
        }

        return body.senders as BrevoApiSender[];
    }
}
