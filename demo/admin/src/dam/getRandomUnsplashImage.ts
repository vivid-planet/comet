export interface UnsplashImage {
    file: File;
    url: string;
}

class ExtendedFile extends File {
    importSource?: { importSourceType: string; importSourceId: string };

    constructor(blob: BlobPart[], fileName: string, options: FilePropertyBag) {
        super(blob, fileName, options);
    }
}

async function fetchUnsplashImage(url: string) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch image");
    }

    return {
        blob: await response.blob(),
        origin: response.url,
    };
}

function extractFileNameFromUrl(url: string): string {
    const fileNameWithQuery = url.split("?")[0];
    const fileName = fileNameWithQuery.split("/").pop();
    return fileName ? `${fileName}.jpeg` : "unnamed.jpeg";
}

export async function getRandomUnsplashImage(): Promise<UnsplashImage> {
    const imageUrl = "https://source.unsplash.com/all/";

    try {
        const image = await fetchUnsplashImage(imageUrl);
        const mimeType = image.blob.type;

        if (mimeType !== "image/jpeg") {
            return getRandomUnsplashImage();
        }

        const fileName = extractFileNameFromUrl(image.origin);
        const acceptedFile = new ExtendedFile([image.blob], fileName, { type: mimeType });
        acceptedFile.importSource = {
            importSourceId: image.origin,
            importSourceType: "unsplash",
        };

        return {
            file: acceptedFile,
            url: image.origin,
        };
    } catch (error) {
        throw new Error(`Failed to fetch image: ${error}`);
    }
}
