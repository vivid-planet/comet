export interface UnsplashImage {
    file: File;
    url: string;
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
        const acceptedFile = new File([image.blob], fileName, { type: mimeType });

        return {
            file: acceptedFile,
            url: image.origin,
        };
    } catch (error) {
        throw new Error(`Failed to fetch image: ${error}`);
    }
}
