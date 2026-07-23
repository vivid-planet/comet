import { loadMessages } from "@src/util/loadMessages";
import { getWelcomeEmailConfig } from "@src/welcomeEmail/util/getWelcomeEmailConfig";

import { WelcomeEmailPreview } from "./WelcomeEmailPreview";

export default async function Page({ params }: PageProps<"/block-preview/[domain]/[language]/welcome-email">) {
    const { domain, language } = await params;
    const messages = await loadMessages(language);

    return <WelcomeEmailPreview language={language} messages={messages} config={getWelcomeEmailConfig({ domain, language })} />;
}
