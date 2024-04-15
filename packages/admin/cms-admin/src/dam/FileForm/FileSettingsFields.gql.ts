import { gql } from "@apollo/client";

export const generateAltTextMutation = gql`
    mutation GenerateAltText($fileId: String!) {
        generateAltText(fileId: $fileId)
    }
`;

export const generateImageTitleMutation = gql`
    mutation GenerateImageTitle($fileId: String!) {
        generateImageTitle(fileId: $fileId)
    }
`;
