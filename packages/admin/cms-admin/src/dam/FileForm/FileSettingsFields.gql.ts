import { gql } from "@apollo/client";

export const generateAltTextMutation = gql`
    mutation GenerateAltText($fileUrl: String!) {
        generateAltText(fileUrl: $fileUrl)
    }
`;

export const generateImageTitleMutation = gql`
    mutation GenerateImageTitle($fileUrl: String!) {
        generateImageTitle(fileUrl: $fileUrl)
    }
`;
