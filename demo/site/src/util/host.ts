/**
 * Removes everything that may differ between an equivalent host header, a configured site-config domain
 * and a redirect source: scheme, path, casing, the fully-qualified trailing dot and default ports.
 * Comparing canonical forms keeps equivalent hosts from being treated as unknown domains.
 */
export function canonicalizeHost(hostOrUrl: string): string {
    let url: URL;
    try {
        url = new URL(hostOrUrl.includes("://") ? hostOrUrl : `https://${hostOrUrl}`);
    } catch {
        return hostOrUrl.trim().toLowerCase();
    }
    const hostname = url.hostname.replace(/\.$/, "");
    return url.port ? `${hostname}:${url.port}` : hostname;
}

export const removeWww = (host: string) => (host.startsWith("www.") ? host.substring(4) : host);
