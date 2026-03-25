let imageSeed = 0;

function createPublicImageUrl(width: number, height: number): string {
    imageSeed++;
    return `https://picsum.photos/seed/${imageSeed}/${width * 2}/${height * 2}`;
}

export function replaceImagesWithPublicUrl(html: string): string {
    return html
        .replace(/<img[^>]*width=["']?(\d+)["']?[^>]*height=["']?(\d+)["']?[^>]*(?:\/>|>)/gi, (match, width, height) => {
            return match.replace(/src=["'].*?["']/i, `src="${createPublicImageUrl(Number(width), Number(height))}"`);
        })
        .replace(/<img[^>]*height=["']?(\d+)["']?[^>]*width=["']?(\d+)["']?[^>]*(?:\/>|>)/gi, (match, height, width) => {
            return match.replace(/src=["'].*?["']/i, `src="${createPublicImageUrl(Number(width), Number(height))}"`);
        });
}
