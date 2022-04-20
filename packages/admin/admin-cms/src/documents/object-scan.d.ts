// Incomplete
declare module "object-scan" {
    function objectScan(patterns: string[], options: { joined: boolean }): (object: Record<string, unknown>) => string[];

    export default objectScan;
}
