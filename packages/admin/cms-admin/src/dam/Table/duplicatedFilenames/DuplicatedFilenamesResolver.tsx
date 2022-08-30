import { useApolloClient } from "@apollo/client";
import * as React from "react";

import { GQLDamAreFilenamesOccupiedQuery, GQLDamAreFilenamesOccupiedQueryVariables, GQLFilenameResponse } from "../../../graphql.generated";
import { DuplicatedFilenameDialog } from "./DuplicatedFilenameDialog";
import { damAreFilenamesOccupied } from "./DuplicatedFilenamesResolver.gql";

export interface DuplicatedFilenamesResolverApi {
    checkForDuplicates: (fileData: FilenameData[]) => Promise<GQLFilenameResponse[]>;
    resolveDuplicates: (fileData: FilenameData[]) => Promise<FilenameData[]>;
}

export interface FilenameData {
    name: string;
    folderId?: string;
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

    const [occupiedFilenames, setOccupiedFilenames] = React.useState<FilenameData[]>([]);
    const [unoccupiedFilenames, setUnoccupiedFilenames] = React.useState<FilenameData[]>([]);
    const [callback, setCallback] = React.useState<(newFilenames: FilenameData[]) => unknown>();

    const checkForDuplicates = React.useCallback(
        async (filenameData: FilenameData[]) => {
            const { data } = await client.query<GQLDamAreFilenamesOccupiedQuery, GQLDamAreFilenamesOccupiedQueryVariables>({
                query: damAreFilenamesOccupied,
                variables: {
                    filenames: filenameData.map((file) => ({
                        name: file.name,
                        folderId: file.folderId,
                    })),
                },
                fetchPolicy: "network-only",
            });

            return data.filenamesResponse;
        },
        [client],
    );

    const resolveDuplicates = React.useCallback(
        async (fileData: FilenameData[]): Promise<FilenameData[]> => {
            const potentialDuplicates = await checkForDuplicates(fileData);

            const occupiedFilenames: FilenameData[] = [];
            const unoccupiedFilenames: FilenameData[] = [];

            for (const potentialDuplicate of potentialDuplicates) {
                const potentialDuplicateFilenameData = { ...potentialDuplicate, folderId: potentialDuplicate.folderId ?? undefined };
                if (potentialDuplicate.isOccupied) {
                    occupiedFilenames.push(potentialDuplicateFilenameData);
                } else {
                    unoccupiedFilenames.push(potentialDuplicateFilenameData);
                }
            }

            if (occupiedFilenames.length === 0) {
                return unoccupiedFilenames;
            }

            setOccupiedFilenames(occupiedFilenames);
            setUnoccupiedFilenames(unoccupiedFilenames);

            const finalFilenameData = await new Promise<FilenameData[]>((resolve) => {
                setCallback(() => (fileData: FilenameData[]) => resolve(fileData));
            });

            return finalFilenameData;
        },
        [checkForDuplicates],
    );

    const onSkip = () => {
        callback?.(unoccupiedFilenames);
        setOccupiedFilenames([]);
    };

    const onUpload = () => {
        callback?.([...unoccupiedFilenames, ...occupiedFilenames]);
        setOccupiedFilenames([]);
    };

    return (
        <DuplicatedFilenamesResolverContext.Provider
            value={{
                checkForDuplicates,
                resolveDuplicates,
            }}
        >
            {children}
            <DuplicatedFilenameDialog open={occupiedFilenames.length > 0} filenameData={occupiedFilenames} onSkip={onSkip} onUpload={onUpload} />
        </DuplicatedFilenamesResolverContext.Provider>
    );
};
