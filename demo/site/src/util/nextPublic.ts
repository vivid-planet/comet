import { type NextPublicEnvs } from "./NextPublicProvider";

export function extractNextPublicEnvs(envs: typeof process.env): NextPublicEnvs {
    return Object.fromEntries(
        Object.entries(envs)
            .filter(([key]) => key.startsWith("NEXT_PUBLIC_"))
            .map(([key, val]) => [key.replace("NEXT_PUBLIC_", ""), val || ""]),
    );
}
