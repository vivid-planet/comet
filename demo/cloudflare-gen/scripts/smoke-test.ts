/**
 * Exercises the API end-to-end through the typed clients, against the Vite dev server: `pnpm smoke-test [baseUrl]`.
 * Logs in through the Access emulator of the dev server, like a browser.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { DamRoutes } from "@dextinity/dam/server";
import type { PermissionsRoutes } from "@dextinity/permissions/server";
import { hc } from "hono/client";
import sharp, { type Sharp } from "sharp";

import type { DamScope } from "../src/worker/dam/dam-scope.ts";

const baseUrl = process.argv[2] ?? `http://localhost:${process.env.CLOUDFLARE_GEN_PORT}`;
const scope = { domain: "main" };

/** Logs in like a browser and returns the cookie of the Access session */
async function login(userId: string): Promise<string> {
    const response = await fetch(`${baseUrl}/cdn-cgi/access/login`, {
        method: "POST",
        body: new URLSearchParams({ user: userId, redirect_url: "/" }),
        redirect: "manual",
    });
    const cookie = response.headers.get("set-cookie")?.split(";")[0];
    if (!cookie) {
        throw new Error(`Login as user ${userId} failed: ${response.status}`);
    }
    return cookie;
}

const createDamClient = (headers: Record<string, string> = {}) => hc<DamRoutes<typeof DamScope>>(`${baseUrl}/api/dam`, { headers });
const createPermissionsClient = (headers: Record<string, string> = {}) => hc<PermissionsRoutes>(`${baseUrl}/api`, { headers });

const adminCookie = await login("1");
const api = createDamClient({ cookie: adminCookie });
const editorApi = createDamClient({ cookie: await login("2") });
const guestCookie = await login("3");
const guestApi = createDamClient({ cookie: guestCookie });
const anonymousApi = createDamClient();

let failures = 0;

async function step(name: string, run: () => Promise<void>): Promise<void> {
    try {
        await run();
        console.info(`✔ ${name}`);
    } catch (error) {
        failures++;
        console.error(`✘ ${name}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function expectEqual<T>(actual: T, expected: T, label = "value"): void {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${label} to be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

interface TypedResponse {
    ok: boolean;
    status: number;
    clone(): { text(): Promise<string> };
}

/** Narrows a response of the typed client to its success types, which excludes e.g. the validation error responses. */
async function expectOk<T extends TypedResponse>(response: T): Promise<Exclude<T, { ok: false }>> {
    if (!response.ok) {
        throw new Error(`${response.status} ${await response.clone().text()}`);
    }
    return response as Exclude<T, { ok: false }>;
}

const { databaseDialect } = await (await fetch(`${baseUrl}/api/status`)).json();
console.info(`Database: ${databaseDialect}\n`);

const imageBytes = await readFile(resolve(import.meta.dirname, "../../api/src/db/fixtures/assets/images/03.jpg"));

await step("get the current user with grants from the rules", async () => {
    const me = await (await expectOk(await createPermissionsClient({ cookie: adminCookie }).me.$get())).json();
    expectEqual([me.name, me.groups, me.grants], ["Admin", ["admins"], [{ permission: "dam", contentScopes: [{ domain: "*" }] }]]);
    expectEqual(me.contentScopes, [{ domain: "main" }, { domain: "secondary" }], "contentScopes");
});

await step("get the current user with a stored grant", async () => {
    const me = await (await expectOk(await createPermissionsClient({ cookie: guestCookie }).me.$get())).json();
    expectEqual(me.grants, [{ permission: "dam", contentScopes: [{ domain: "secondary" }] }], "grants");
    expectEqual(me.contentScopes, [{ domain: "secondary" }], "contentScopes");
});

const folderResponse = await expectOk(await api.folders.$post({ json: { name: `Smoke Test ${Date.now()}`, scope } }));
const folder = await folderResponse.json();
console.info(`✔ create folder ${folder.name}`);

const uploadResponse = await expectOk(
    await api.files.upload.$post({
        form: { file: new File([imageBytes], "Smoke Test Image.jpg", { type: "image/jpeg" }), scope: JSON.stringify(scope), folderId: folder.id },
    }),
);
const file = await uploadResponse.json();
console.info(`✔ upload ${file.name} (${file.image?.width}x${file.image?.height}, dominant color ${file.image?.dominantColor})`);

await step("calculate the dimensions and dominant color on upload", async () => {
    const { width, height } = await sharp(imageBytes).metadata();
    expectEqual([file.image?.width, file.image?.height], [width, height], "dimensions");
    expectEqual(/^#[0-9a-f]{6}$/.test(file.image?.dominantColor ?? ""), true, "dominant color is a hex color");
});

await step("list DAM items of the folder", async () => {
    const { nodes, totalCount } = await (await expectOk(await api.items.$get({ query: { ...scope, folderId: folder.id } }))).json();
    expectEqual(totalCount, 1, "totalCount");
    expectEqual(nodes[0].__typename, "DamFile", "__typename");
});

await step("search files case-insensitively", async () => {
    const { totalCount } = await (await expectOk(await api.files.$get({ query: { ...scope, searchText: "SMOKE-TEST-image" } }))).json();
    expectEqual(totalCount >= 1, true, "found");
});

await step("get file with DAM path", async () => {
    const details = await (await expectOk(await api.files[":id"].$get({ param: { id: file.id } }))).json();
    expectEqual(details.damPath, `/${folder.name}`, "damPath");
    expectEqual(details.scope.domain, "main", "scope.domain");
});

await step("update title and alt text", async () => {
    const updated = await (
        await expectOk(await api.files[":id"].$patch({ param: { id: file.id }, json: { title: "Smoke", altText: "Alt" } }))
    ).json();
    expectEqual([updated.title, updated.altText], ["Smoke", "Alt"]);
});

await step("filename is occupied", async () => {
    const [result] = await (
        await expectOk(
            await api.files["filenames-occupied"].$post({ json: { scope, filenames: [{ name: "Smoke Test Image.jpg", folderId: folder.id }] } }),
        )
    ).json();
    expectEqual(result.isOccupied, true, "isOccupied");
});

await step("download the file from its public URL without login", async () => {
    const response = await fetch(`${baseUrl}/api${file.fileUrl}`);
    expectEqual(response.status, 200, "status");
    expectEqual(Buffer.from(await response.arrayBuffer()).equals(imageBytes), true, "bytes match");
    expectEqual(response.headers.get("cache-control"), "max-age=31536000, s-maxage=86400, public", "cache-control");
});

await step("download a range of the file", async () => {
    const response = await fetch(`${baseUrl}/api${file.fileUrl}`, { headers: { Range: "bytes=0-99" } });
    expectEqual(response.status, 206, "status");
    expectEqual((await response.arrayBuffer()).byteLength, 100, "length");
});

await step("reject a file URL with an invalid hash", async () => {
    const response = await fetch(`${baseUrl}/api${file.fileUrl.replace(/files\/[0-9a-f]{40}/, `files/${"0".repeat(40)}`)}`);
    expectEqual(response.status, 400, "status");
});

await step("deliver a smart-cropped image in the format of the Accept header", async () => {
    const url = file.image?.urlTemplate.replace("$resizeWidth", "640").replace("$resizeHeight", "360");
    const response = await fetch(`${baseUrl}/api${url}`, { headers: { Accept: "image/webp,*/*" } });
    expectEqual(response.status, 200, "status");
    expectEqual(response.headers.get("content-type"), "image/webp", "content-type");
    const { format, width, height } = await sharp(await response.arrayBuffer()).metadata();
    expectEqual([format, width, height], ["webp", 640, 360], "format and dimensions");
});

await step("deliver AVIF when accepted", async () => {
    const url = file.image?.urlTemplate.replace("$resizeWidth", "320").replace("$resizeHeight", "180");
    const response = await fetch(`${baseUrl}/api${url}`, { headers: { Accept: "image/avif,image/webp,*/*" } });
    expectEqual(response.headers.get("content-type"), "image/avif", "content-type");
});

await step("deliver the crop area of the image", async () => {
    const cropArea = { focalPoint: "CENTER" as const, width: 50, height: 50, x: 50, y: 50 };
    const updated = await (await expectOk(await api.files[":id"].$patch({ param: { id: file.id }, json: { image: { cropArea } } }))).json();
    if (!updated.image) {
        throw new Error("Not an image");
    }
    const { width, height } = updated.image;
    const resizeHeight = Math.ceil(320 / ((width * 0.5) / (height * 0.5)));
    const url = updated.image.urlTemplate.replace("$resizeWidth", "320").replace("$resizeHeight", String(resizeHeight));
    const response = await fetch(`${baseUrl}/api${url}`, { headers: { Accept: "image/png" } });
    expectEqual(response.status, 200, "status");
    const delivered = Buffer.from(await response.arrayBuffer());
    const { width: deliveredWidth, height: deliveredHeight } = await sharp(delivered).metadata();
    expectEqual([deliveredWidth, deliveredHeight], [320, resizeHeight], "dimensions");

    // The bottom right quarter of the original, scaled to the same size, must look the same
    const thumbnail = (image: Sharp) => image.resize(8, 8, { fit: "fill" }).removeAlpha().raw().toBuffer();
    const expectedPixels = await thumbnail(
        sharp(imageBytes).extract({
            left: Math.round(width / 2),
            top: Math.round(height / 2),
            width: Math.floor(width / 2),
            height: Math.floor(height / 2),
        }),
    );
    const deliveredPixels = await thumbnail(sharp(delivered));
    const difference = expectedPixels.reduce((sum, value, index) => sum + Math.abs(value - deliveredPixels[index]), 0) / expectedPixels.length;
    expectEqual(difference < 20, true, `average pixel difference ${difference.toFixed(1)} below 20`);
});

await step("reject an image size that isn't allowed", async () => {
    const url = file.image?.urlTemplate.replace("$resizeWidth", "641").replace("$resizeHeight", "361");
    expectEqual((await fetch(`${baseUrl}/api${url}`)).status, 400, "status");
});

await step("archive and restore", async () => {
    const [archived] = await (await expectOk(await api.files.archive.$post({ json: { ids: [file.id] } }))).json();
    expectEqual(archived.archived, true, "archived");
    const { totalCount } = await (await expectOk(await api.files.$get({ query: { ...scope, folderId: folder.id } }))).json();
    expectEqual(totalCount, 0, "totalCount without archived");
    const [restored] = await (await expectOk(await api.files.restore.$post({ json: { ids: [file.id] } }))).json();
    expectEqual(restored.archived, false, "archived");
});

await step("create subfolders and get the ancestors recursively", async () => {
    const subfolder = await (await expectOk(await api.folders.$post({ json: { name: "Subfolder", parentId: folder.id, scope } }))).json();
    const subsubfolder = await (await expectOk(await api.folders.$post({ json: { name: "Subsubfolder", parentId: subfolder.id, scope } }))).json();
    const details = await (await expectOk(await api.folders[":id"].$get({ param: { id: subsubfolder.id } }))).json();
    expectEqual(
        details.parents.map(({ name }) => name),
        [folder.name, "Subfolder"],
        "parents",
    );
    const moveResponse = await api.folders[":id"].$patch({ param: { id: folder.id }, json: { parentId: subsubfolder.id } });
    expectEqual(moveResponse.status, 400, "status when moving a folder into its own child");
});

await step("download the folder as zip", async () => {
    const response = await expectOk(await api.folders[":id"].zip.$get({ param: { id: folder.id } }));
    expectEqual(response.headers.get("content-type"), "application/zip", "content-type");
});

await step("get the position of the file in the folder", async () => {
    const { position } = await (
        await expectOk(await api.items.position.$get({ query: { ...scope, folderId: folder.id, id: file.id, type: "File", sortColumnName: "name" } }))
    ).json();
    expectEqual(position, 1, "position (after the subfolder)");
});

await step("allow editors (group role) in their scope only", async () => {
    expectEqual((await editorApi.items.$get({ query: { domain: "main" } })).status, 200, "status in main");
    expectEqual((await editorApi.items.$get({ query: { domain: "secondary" } })).status, 403, "status in secondary");
    expectEqual((await editorApi.files[":id"].$get({ param: { id: file.id } })).status, 200, "status of a file in main");
});

await step("allow guests (stored grant) in their scope only", async () => {
    expectEqual((await guestApi.items.$get({ query: { domain: "secondary" } })).status, 200, "status in secondary");
    expectEqual((await guestApi.items.$get({ query: { domain: "main" } })).status, 403, "status in main");
    expectEqual((await guestApi.files[":id"].$get({ param: { id: file.id } })).status, 403, "status of a file in main");
});

await step("deny anonymous requests", async () => {
    expectEqual((await anonymousApi.items.$get({ query: scope })).status, 401, "status");
});

await step("deny a forged Access JWT", async () => {
    const forged = `${adminCookie.slice(0, -10)}AAAAAAAAAA`;
    expectEqual((await createDamClient({ cookie: forged }).items.$get({ query: scope })).status, 401, "status");
});

await step("reject invalid input", async () => {
    expectEqual((await api.files[":id"].$get({ param: { id: "not-a-uuid" } })).status, 400, "status");
});

await step("delete the folder with its files", async () => {
    const { deleted } = await (await expectOk(await api.folders[":id"].$delete({ param: { id: folder.id } }))).json();
    expectEqual(deleted, true, "deleted");
    expectEqual((await api.files[":id"].$get({ param: { id: file.id } })).status, 404, "status of the deleted file");
    expectEqual((await fetch(`${baseUrl}/api${file.fileUrl}`)).status, 404, "status of the deleted file's URL");
});

if (failures > 0) {
    console.error(`\n${failures} step(s) failed`);
    process.exit(1);
}
console.info("\nAll steps passed");
