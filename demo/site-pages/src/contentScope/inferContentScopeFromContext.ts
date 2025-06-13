import { defaultLanguage, domain } from "@src/config";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";

import { ContentScope } from "./ContentScope";

function inferContentScopeFromContext(context: GetStaticPropsContext | GetServerSidePropsContext): ContentScope {
    if (typeof context.params?.domain === "string" && typeof context.params?.language === "string") {
        // Site preview
        return { domain: context.params.domain, language: context.params.language };
    } else {
        // Live site
        const language = context.locale ?? defaultLanguage;
        return { domain, language };
    }
}

export { inferContentScopeFromContext };
