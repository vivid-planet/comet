import * as Brevo from "@getbrevo/brevo";
import { Inject, Injectable } from "@nestjs/common";
import { EmailCampaignScopeInterface } from "src/types";

import { BrevoModuleConfig } from "../config/brevo-module.config";
import { BREVO_MODULE_CONFIG } from "../config/brevo-module.constants";
import { handleBrevoError } from "./brevo-api.utils";
import { BrevoApiFolder } from "./dto/brevo-api-folder";

@Injectable()
export class BrevoApiFoldersService {
    private readonly contactsApi: Brevo.ContactsApi;

    constructor(@Inject(BREVO_MODULE_CONFIG) private readonly config: BrevoModuleConfig) {
        this.contactsApi = new Brevo.ContactsApi();
    }

    async *getAllBrevoFolders(scope: EmailCampaignScopeInterface): AsyncGenerator<BrevoApiFolder, void, undefined> {
        const apiKey = this.config.brevo.resolveConfig(scope).apiKey;
        this.contactsApi.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);

        // Limit set by Brevo
        const limit = 50;
        let offset = 0;

        while (true) {
            try {
                const { response, body } = await this.contactsApi.getFolders(limit, offset);

                if (response.statusCode !== 200) {
                    throw new Error("Failed to get folders");
                }

                const folders = body.folders ?? [];
                if (folders.length === 0) {
                    break;
                }

                yield* folders;

                offset += limit;
            } catch (error) {
                handleBrevoError(error);
            }
        }
    }
}
