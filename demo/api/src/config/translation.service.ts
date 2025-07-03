import { Injectable } from "@nestjs/common";
import { getMessages, SupportedLanguage } from "@src/common/lang";
import { createIntl, createIntlCache, IntlCache } from "react-intl";

@Injectable()
export class TranslationService {
    private readonly intlCache: IntlCache;
    constructor() {
        this.intlCache = createIntlCache();
    }

    getIntl(language: SupportedLanguage) {
        return createIntl(
            {
                // Locale of the application
                locale: language,
                // Locale of the fallback defaultMessage
                defaultLocale: language,
                messages: getMessages(language),
            },
            this.intlCache,
        );
    }
}
