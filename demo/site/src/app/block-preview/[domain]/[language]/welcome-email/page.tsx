import { loadMessages } from "@src/util/loadMessages";

import { WelcomeEmailPreview } from "./WelcomeEmailPreview";

export default async function Page({ params }: PageProps<"/block-preview/[domain]/[language]/welcome-email">) {
    const { language } = await params;
    const messages = await loadMessages(language);

    return <WelcomeEmailPreview language={language} messages={messages} />;
}
