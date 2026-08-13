import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import type { GQLDamFileAiContentType } from "../../graphql.generated";

export type DamFileAiContentType = GQLDamFileAiContentType;

export const aiContentTypeArray: readonly DamFileAiContentType[] = ["Generated", "Modified"];

export const aiContentTypeLabels: { [key in DamFileAiContentType]: ReactNode } = {
    Generated: <FormattedMessage id="comet.dam.file.aiContentType.generated" defaultMessage="AI generated" />,
    Modified: <FormattedMessage id="comet.dam.file.aiContentType.modified" defaultMessage="AI modified" />,
};

export function getSelectableAiContentTypes({
    configuredAiContentTypes = aiContentTypeArray,
    currentAiContentType,
}: {
    configuredAiContentTypes?: readonly DamFileAiContentType[];
    // A type that is already set on the file stays selectable, so that an existing value isn't silently changed on save.
    currentAiContentType?: DamFileAiContentType | null;
}): DamFileAiContentType[] {
    return aiContentTypeArray.filter((aiContentType) => configuredAiContentTypes.includes(aiContentType) || aiContentType === currentAiContentType);
}
