import type { AiContentAltTextLabels } from "@comet/site-nextjs";
import { useIntl } from "react-intl";

export function useAiContentAltTextLabels(): AiContentAltTextLabels {
    const intl = useIntl();

    return {
        generated: intl.formatMessage({ id: "aiContentDisclosure.altText.generated", defaultMessage: "AI-generated" }),
        modified: intl.formatMessage({ id: "aiContentDisclosure.altText.modified", defaultMessage: "AI-modified" }),
    };
}
