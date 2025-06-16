// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadNodemailerDependency<T = any>(): T | null {
    try {
        // Use require for sync loading (CommonJS)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require("nodemailer");
        return mod.default ?? mod;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        throw new Error(`Optional dependency "nodemailer" not installed:`, err.message);
    }
}
