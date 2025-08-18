import { type GQLActionLogCompareQuery } from "./useActionLogCompareQuery/useActionLogCompareQuery.gql.generated";

/**
 * This function extracts from the data, the two versions to compare, based on the versionId1 and versionId2.
 *
 * version1 is the older version and version2 is the newer version.
 */
export const getCompareVersions = ({ data, versionId1, versionId2 }: { data?: GQLActionLogCompareQuery; versionId1: string; versionId2: string }) => {
    if (data == null) {
        return { afterVersion: null, beforeVersion: null };
    }
    const version1 = data?.actionLogs.nodes.find((node) => {
        return node.id === versionId1;
    });
    const version2 = data?.actionLogs.nodes.find((node) => {
        return node.id === versionId2;
    });

    if (!version1 || !version2) {
        return { afterVersion: version2, beforeVersion: version1 };
    } else if (version1.version < version2.version) {
        return { afterVersion: version2, beforeVersion: version1 };
    } else {
        // version 2 is older than version 1 --> swap versions
        return { afterVersion: version1, beforeVersion: version2 };
    }
};
