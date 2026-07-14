import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import type { GQLDamFileAiGeneration } from "../../graphql.generated";

export type AiGenerationType = GQLDamFileAiGeneration | "NotAiGenerated";

export const aiGenerationTypeArray: readonly AiGenerationType[] = ["NotAiGenerated", "AiGenerated", "AiModified"];

export const aiGenerationTypeLabels: { [key in AiGenerationType]: ReactNode } = {
    NotAiGenerated: <FormattedMessage id="comet.dam.file.aiGeneration.notAiGenerated" defaultMessage="Not AI-generated" />,
    AiGenerated: <FormattedMessage id="comet.dam.file.aiGeneration.aiGenerated" defaultMessage="AI generated" />,
    AiModified: <FormattedMessage id="comet.dam.file.aiGeneration.aiModified" defaultMessage="AI modified" />,
};
