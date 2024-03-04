import { gql } from "@apollo/client";

export const generateAltTextMutation = gql`
    mutation GenerateAltText($fileUrl: String!) {
        generateAltText(imageUrl: $fileUrl)
    }
`;

export const generateImageTitleMutation = gql`
    mutation GenerateImageTitle($fileUrl: String!) {
        generateImageTitle(imageUrl: $fileUrl)
    }
`;
