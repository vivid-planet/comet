import { useApolloClient } from "@apollo/client";
import * as React from "react";

import {
    GQLDamFindAlternativesToDuplicatedFilenamesQuery,
    GQLDamFindAlternativesToDuplicatedFilenamesQueryVariables,
    GQLFilenameInput,
    GQLFilenameResponse,
} from "../../../graphql.generated";
import { DuplicatedFilenameDialog } from "./DuplicatedFilenameDialog";
import { damFindAlternativesToDuplicatedFilenamesQuery } from "./DuplicatedFilenamesResolver.gql";

export interface DuplicatedFilenamesResolverApi {
    checkForDuplicates: (filenames: GQLFilenameInput[]) => Promise<GQLFilenameResponse[]>;
    resolveDuplicates: (filenames: GQLFilenameInput[], callback: (newFilenames: GQLFilenameInput[]) => unknown) => Promise<void>;
}

export const DuplicatedFilenamesResolverContext = React.createContext<DuplicatedFilenamesResolverApi>({
    checkForDuplicates: () => {
        throw new Error("DuplicatedFilenamesResolver has to be defined higher up in the tree");
    },
    resolveDuplicates: () => {
        throw new Error("DuplicatedFilenamesResolver has to be defined higher up in the tree");
    },
});

export const useDuplicatedFilenamesResolver = (): DuplicatedFilenamesResolverApi => {
    return React.useContext(DuplicatedFilenamesResolverContext);
};

export const DuplicatedFilenamesResolver: React.FunctionComponent = ({ children }) => {
    const client = useApolloClient();

    const [occupiedFilenames, setOccupiedFilenames] = React.useState<GQLFilenameResponse[]>([]);
    const [newFilenames, setNewFilenames] = React.useState<GQLFilenameInput[]>([]);
    const [callback, setCallback] = React.useState<(newFilenames: GQLFilenameInput[]) => unknown>();

    const checkForDuplicates = React.useCallback(
        async (filenames: GQLFilenameInput[]) => {
            const { data } = await client.query<
                GQLDamFindAlternativesToDuplicatedFilenamesQuery,
                GQLDamFindAlternativesToDuplicatedFilenamesQueryVariables
            >({
                query: damFindAlternativesToDuplicatedFilenamesQuery,
                variables: { filenames: filenames },
                fetchPolicy: "network-only",
            });

            return data.alternatives;
        },
        [client],
    );

    const resolveDuplicates = React.useCallback(
        async (filenames: GQLFilenameInput[], callback: (newFilenames: GQLFilenameInput[]) => unknown) => {
            const alternatives = await checkForDuplicates(filenames);

            const occupiedFilenames: GQLFilenameResponse[] = [];
            const unoccupiedFilenames: GQLFilenameInput[] = [];

            for (const alternative of alternatives) {
                if (alternative.isOccupied) {
                    occupiedFilenames.push(alternative);
                } else {
                    unoccupiedFilenames.push({ name: alternative.originalName, folderId: alternative.folderId });
                }
            }

            setOccupiedFilenames(occupiedFilenames);
            setNewFilenames(unoccupiedFilenames);
            setCallback(() => callback);
        },
        [checkForDuplicates],
    );

    React.useEffect(() => {
        if (occupiedFilenames.length === 0) {
            callback?.(newFilenames);
        }
    }, [occupiedFilenames.length, callback, newFilenames, occupiedFilenames]);

    return (
        <DuplicatedFilenamesResolverContext.Provider
            value={{
                checkForDuplicates,
                resolveDuplicates,
            }}
        >
            {children}
            <DuplicatedFilenameDialog
                open={occupiedFilenames.length > 0}
                currentFilename={occupiedFilenames[0]?.originalName}
                suggestedFilename={occupiedFilenames[0]?.alternativeName ?? undefined}
                folderId={occupiedFilenames[0]?.folderId ?? null}
                onRename={(newFilename) => {
                    setNewFilenames((newFilenames) => [...newFilenames, { name: newFilename, folderId: occupiedFilenames[0].folderId }]);
                    setOccupiedFilenames((alternatives) => {
                        alternatives.shift();
                        return alternatives;
                    });
                }}
                onCancel={() => {
                    // TODO
                    return;
                }}
            />
        </DuplicatedFilenamesResolverContext.Provider>
    );
};
