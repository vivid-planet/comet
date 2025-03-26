import { gql } from "@apollo/client";

export const generateAltTextMutation = gql`
    mutation GenerateAltText($fileId: String!, $language: String!) {
        generateAltText(fileId: $fileId, language: $language)
    }
`;

export const generateImageTitleMutation = gql`
    mutation GenerateImageTitle($fileId: String!, $language: String!) {
        generateImageTitle(fileId: $fileId, language: $language)
    }
`;
