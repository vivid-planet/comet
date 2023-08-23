import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";

import { GQLHmacValidateQuery, GQLHmacValidateQueryVariables } from "./preview.generated";

export default async function handler(req, res) {
    const data = await createGraphQLClient().request<GQLHmacValidateQuery, GQLHmacValidateQueryVariables>(
        gql`
            query HmacValidate($timestamp: Float!, $hash: String!) {
                hmacValidate(timestamp: $timestamp, hash: $hash)
            }
        `,
        {
            timestamp: parseInt(req.query.timestamp),
            hash: req.query.hash,
        },
    );
    if (!data.hmacValidate) {
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
