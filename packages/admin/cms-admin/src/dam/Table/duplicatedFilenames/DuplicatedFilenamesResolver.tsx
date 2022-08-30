import { useApolloClient } from "@apollo/client";
import * as React from "react";

import { GQLDamAreFilenamesOccupiedQuery, GQLDamAreFilenamesOccupiedQueryVariables, GQLFilenameResponse } from "../../../graphql.generated";
import { DuplicatedFilenameDialog } from "./DuplicatedFilenameDialog";
import { damAreFilenamesOccupied } from "./DuplicatedFilenamesResolver.gql";

export interface DuplicatedFilenamesResolverApi {
    checkForDuplicates: (fileData: FileData[]) => Promise<GQLFilenameResponse[]>;
    resolveDuplicates: (fileData: FileData[]) => Promise<FileData[]>;
}

export interface FileData {
    file: File;
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

    const [occupiedFilenames, setOccupiedFilenames] = React.useState<FileData[]>([]);
    const [unoccupiedFilenames, setUnoccupiedFilenames] = React.useState<FileData[]>([]);
    const [callback, setCallback] = React.useState<(newFilenames: FileData[]) => unknown>();

    const checkForDuplicates = React.useCallback(
        async (fileData: FileData[]) => {
            const { data } = await client.query<GQLDamAreFilenamesOccupiedQuery, GQLDamAreFilenamesOccupiedQueryVariables>({
                query: damAreFilenamesOccupied,
                variables: {
                    filenames: fileData.map((data) => ({
                        name: data.file.name,
                        folderId: data.folderId,
                    })),
                },
                fetchPolicy: "network-only",
            });

            return data.filenamesResponse;
        },
        [client],
    );

    const resolveDuplicates = React.useCallback(
        async (fileData: FileData[]): Promise<FileData[]> => {
            const potentialDuplicates = await checkForDuplicates(fileData);

            const occupiedFilenames: FileData[] = [];
            const unoccupiedFilenames: FileData[] = [];

            for (const potentialDuplicate of potentialDuplicates) {
                if (potentialDuplicate.isOccupied) {
                    occupiedFilenames.push(
                        fileData.find((data) => {
                            return data.file.name === potentialDuplicate.name && (data.folderId ?? null) === potentialDuplicate.folderId;
                        }) as FileData,
                    );
                } else {
                    unoccupiedFilenames.push(
                        fileData.find((data) => {
                            return data.file.name === potentialDuplicate.name && (data.folderId ?? null) === potentialDuplicate.folderId;
                        }) as FileData,
                    );
                }
            }

            setOccupiedFilenames(occupiedFilenames);
            setUnoccupiedFilenames(unoccupiedFilenames);

            const finalFileData = await new Promise<FileData[]>((resolve) => {
                setCallback(() => (fileData: FileData[]) => resolve(fileData));
            });

            return finalFileData;
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
            <DuplicatedFilenameDialog open={occupiedFilenames.length > 0} fileData={occupiedFilenames} onSkip={onSkip} onUpload={onUpload} />
        </DuplicatedFilenamesResolverContext.Provider>
    );
};
