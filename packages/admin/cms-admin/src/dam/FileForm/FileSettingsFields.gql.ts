import { gql } from "@apollo/client";

export const generateAltTextMutation = gql`
    mutation GenerateAltText($imageUrl: String!) {
        generateAltText(imageUrl: $imageUrl)
    }
`;

export const generateImageTitleMutation = gql`
    mutation GenerateImageTitle($imageUrl: String!) {
        generateImageTitle(imageUrl: $imageUrl)
    }
`;
