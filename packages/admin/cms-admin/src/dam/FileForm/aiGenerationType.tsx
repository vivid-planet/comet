import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import type { GQLDamFileAiGeneration } from "../../graphql.generated";

export type AiGenerationType = GQLDamFileAiGeneration | "NotAiGenerated";

export const aiGenerationTypeArray: readonly AiGenerationType[] = ["NotAiGenerated", "AiGenerated", "FullyAiGenerated", "PartiallyAiModified"];

export const aiGenerationTypeLabels: { [key in AiGenerationType]: ReactNode } = {
    NotAiGenerated: <FormattedMessage id="comet.dam.file.aiGeneration.notAiGenerated" defaultMessage="Not AI-generated" />,
    AiGenerated: <FormattedMessage id="comet.dam.file.aiGeneration.aiGenerated" defaultMessage="AI-generated" />,
    FullyAiGenerated: <FormattedMessage id="comet.dam.file.aiGeneration.fullyAiGenerated" defaultMessage="Fully AI-generated" />,
    PartiallyAiModified: <FormattedMessage id="comet.dam.file.aiGeneration.partiallyAiModified" defaultMessage="Partially AI-modified" />,
};
