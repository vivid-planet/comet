import { registerEnumType } from "@nestjs/graphql";

// Mirrors the three EU icons for labelling AI-generated content (EU AI Act, Art. 50):
// a general disclosure, fully AI-generated, and partially AI-modified content.
// See https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content
export enum DamFileAiGeneration {
    AiGenerated = "AiGenerated",
    FullyAiGenerated = "FullyAiGenerated",
    PartiallyAiModified = "PartiallyAiModified",
}

registerEnumType(DamFileAiGeneration, { name: "DamFileAiGeneration" });
