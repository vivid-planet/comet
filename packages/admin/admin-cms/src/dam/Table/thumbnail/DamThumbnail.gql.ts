import { gql } from "@apollo/client";

export const damFileThumbnailFragment = gql`
    fragment DamFileThumbnail on DamFileImage {
        thumbnailUrl: url(width: 320, height: 320)
    }
`;
