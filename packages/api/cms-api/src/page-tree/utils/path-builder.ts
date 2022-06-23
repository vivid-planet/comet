export default function pathBuilder(slugs: string[]): string {
    const path = `/${slugs.reverse().join("/")}`;

    return path === "/home" ? "/" : path;
}
