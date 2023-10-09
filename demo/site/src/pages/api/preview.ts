import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";

import { GQLValidateSitePreviewHashQuery, GQLValidateSitePreviewHashQueryVariables } from "./preview.generated";

export default async function handler(req, res) {
    const data = await createGraphQLClient().request<GQLValidateSitePreviewHashQuery, GQLValidateSitePreviewHashQueryVariables>(
        gql`
            query ValidateSitePreviewHash($timestamp: Float!, $hash: String!) {
                validateSitePreviewHash(timestamp: $timestamp, hash: $hash)
            }
        `,
        {
            timestamp: parseInt(req.query.timestamp),
            hash: req.query.hash,
        },
    );
    if (!data.validateSitePreviewHash) {
        return res.status(401).json({ message: "Validation failed" });
    }

    const previewData: PreviewData = {
        includeInvisiblePages: true,
        includeInvisibleBlocks: req.query.includeInvisibleBlocks === "true",
        previewDamUrls: true,
    };
    res.setPreviewData(previewData);
    res.redirect(req.query.path ?? "/");
}

export interface PreviewData {
    includeInvisiblePages: boolean;
    includeInvisibleBlocks: boolean;
    previewDamUrls: boolean;
}
