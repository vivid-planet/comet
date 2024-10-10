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
    return fileName ? `${fileName}.png` : "unnamed.png";
}

export async function getRandomUnsplashImage(): Promise<UnsplashImage> {
    const array = [
        "http://localhost:4000/dam/files/preview/54903739-9aa5-4f70-bf75-e585ce69e7fe/image-01",
        "http://localhost:4000/dam/files/preview/16ed8fe6-d3d1-4005-ad77-1acfe5eb2d4a/image-01",
    ];
    const imageUrl = array[Math.floor(Math.random() * array.length)];

    try {
        const image = await fetchUnsplashImage(imageUrl);
        const mimeType = image.blob.type;

        if (mimeType !== "image/png") {
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
