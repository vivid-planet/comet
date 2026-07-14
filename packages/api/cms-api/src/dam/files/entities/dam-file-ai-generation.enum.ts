import { registerEnumType } from "@nestjs/graphql";

// Mirrors the two EU icons for labelling AI-generated content (EU AI Act, Art. 50):
// content that is AI-generated and pre-existing content that is AI-modified.
// See https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content
export enum DamFileAiGeneration {
    AiGenerated = "AiGenerated",
    AiModified = "AiModified",
}

registerEnumType(DamFileAiGeneration, { name: "DamFileAiGeneration" });
