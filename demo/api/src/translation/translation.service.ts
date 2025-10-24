import { Injectable } from "@nestjs/common";
import { loadMessages } from "@src/translation/loadMessages";
import { createIntl, createIntlCache, IntlCache } from "react-intl";

@Injectable()
export class TranslationService {
    private readonly intlCache: IntlCache;
    constructor() {
        this.intlCache = createIntlCache();
    }

    async getIntl(language: string) {
        return createIntl(
            {
                // Locale of the application
                locale: language,
                // Locale of the fallback defaultMessage
                defaultLocale: language,
                messages: await loadMessages(language),
            },
            this.intlCache,
        );
    }
}
