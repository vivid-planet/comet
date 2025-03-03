function hexToRgb(hex: string): [number, number, number] | null {
    const match = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return match ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)] : null;
}

export function logColor(message: string, hexColor: string) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) {
        console.log("Invalid hex color:", hexColor);
        return;
    }
    const [r, g, b] = rgb;
    console.log(`\x1b[38;2;${r};${g};${b}m%s\x1b[0m`, message);
}
