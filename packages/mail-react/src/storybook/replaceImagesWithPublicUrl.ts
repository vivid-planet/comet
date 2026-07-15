export function replaceImagesWithPublicUrl(html: string): string {
    let seedCounter = 0;

    return html.replace(/<img\b[^>]*>/gi, (imgTag) => {
        const widthMatch = imgTag.match(/\bwidth="(\d+)"/);
        const heightMatch = imgTag.match(/\bheight="(\d+)"/);

        if (!widthMatch || !heightMatch) {
            return imgTag;
        }

        const retinaWidth = parseInt(widthMatch[1], 10) * 2;
        const retinaHeight = parseInt(heightMatch[1], 10) * 2;
        const seed = seedCounter++;
        const publicUrl = `https://picsum.photos/seed/${seed}/${retinaWidth}/${retinaHeight}`;

        return imgTag.replace(/\bsrc="[^"]*"/, `src="${publicUrl}"`);
    });
}
