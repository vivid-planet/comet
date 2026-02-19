import { getEmailCampaignConfig } from "@src/brevo/util/getEmailCampaignConfig";
import { loadMessages } from "@src/util/loadMessages";

import { BrevoEmailCampaignPreview } from "./BrevoEmailCampaignPreview";

export default async function Page({ params: { domain, language } }: { params: { domain: string; language: string } }) {
    const messages = await loadMessages(language);

    return <BrevoEmailCampaignPreview language={language} messages={messages} config={getEmailCampaignConfig({ domain, language })} />;
}
