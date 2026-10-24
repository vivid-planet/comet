/**
 * Exercises the DAM routes end-to-end through the typed client: `pnpm smoke-test [baseUrl]`.
 * Runs against the Node.js server by default, pass the URL of `wrangler dev` to test the Worker.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { createApiClient } from "dextinity-demo-api-hono/client";

const baseUrl = process.argv[2] ?? `http://localhost:${process.env.API_HONO_PORT}`;
const api = createApiClient(baseUrl, { headers: { Authorization: `Bearer ${process.env.API_HONO_TOKEN}` } });
const anonymousApi = createApiClient(baseUrl);
const scope = { domain: "main" };

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

const imageBytes = await readFile(resolve(import.meta.dirname, "../../api/src/db/fixtures/assets/images/03.jpg"));

const folderResponse = await expectOk(await api.dam.folders.$post({ json: { name: `Smoke Test ${Date.now()}`, scope } }));
const folder = await folderResponse.json();
console.info(`✔ create folder ${folder.name}`);

const uploadResponse = await expectOk(
    await api.dam.files.upload.$post({
        form: { file: new File([imageBytes], "Smoke Test Image.jpg", { type: "image/jpeg" }), scope: JSON.stringify(scope), folderId: folder.id },
    }),
);
const file = await uploadResponse.json();
console.info(`✔ upload ${file.name} (${file.image?.width}x${file.image?.height})`);

await step("list DAM items of the folder", async () => {
    const { nodes, totalCount } = await (await expectOk(await api.dam.items.$get({ query: { ...scope, folderId: folder.id } }))).json();
    expectEqual(totalCount, 1, "totalCount");
    expectEqual(nodes[0].__typename, "DamFile", "__typename");
});

await step("get file with DAM path", async () => {
    const details = await (await expectOk(await api.dam.files[":id"].$get({ param: { id: file.id } }))).json();
    expectEqual(details.damPath, `/${folder.name}`, "damPath");
    expectEqual(details.scope.domain, "main", "scope.domain");
});

await step("update title and alt text", async () => {
    const updated = await (
        await expectOk(await api.dam.files[":id"].$patch({ param: { id: file.id }, json: { title: "Smoke", altText: "Alt" } }))
    ).json();
    expectEqual([updated.title, updated.altText], ["Smoke", "Alt"]);
});

await step("filename is occupied", async () => {
    const [result] = await (
        await expectOk(
            await api.dam.files["filenames-occupied"].$post({ json: { scope, filenames: [{ name: "Smoke Test Image.jpg", folderId: folder.id }] } }),
        )
    ).json();
    expectEqual(result.isOccupied, true, "isOccupied");
});

await step("download the file from its public URL", async () => {
    const response = await fetch(`${baseUrl}${file.fileUrl}`);
    expectEqual(response.status, 200, "status");
    expectEqual(Buffer.from(await response.arrayBuffer()).equals(imageBytes), true, "bytes match");
    expectEqual(response.headers.get("cache-control"), "max-age=31536000, s-maxage=86400, public", "cache-control");
});

await step("download a range of the file", async () => {
    const response = await fetch(`${baseUrl}${file.fileUrl}`, { headers: { Range: "bytes=0-99" } });
    expectEqual(response.status, 206, "status");
    expectEqual((await response.arrayBuffer()).byteLength, 100, "length");
});

await step("reject a file URL with an invalid hash", async () => {
    const response = await fetch(`${baseUrl}${file.fileUrl.replace(/files\/[0-9a-f]{40}/, `files/${"0".repeat(40)}`)}`);
    expectEqual(response.status, 400, "status");
});

await step("deliver a cropped and resized image through imgproxy", async () => {
    const url = file.image?.urlTemplate.replace("$resizeWidth", "640").replace("$resizeHeight", "360");
    const response = await fetch(`${baseUrl}${url}`, { headers: { Accept: "image/webp,*/*" } });
    expectEqual(response.status, 200, "status");
    expectEqual(response.headers.get("content-type"), "image/webp", "content-type");
});

await step("reject an image size that isn't allowed", async () => {
    const url = file.image?.urlTemplate.replace("$resizeWidth", "641").replace("$resizeHeight", "361");
    expectEqual((await fetch(`${baseUrl}${url}`)).status, 400, "status");
});

await step("archive and restore", async () => {
    const [archived] = await (await expectOk(await api.dam.files.archive.$post({ json: { ids: [file.id] } }))).json();
    expectEqual(archived.archived, true, "archived");
    const { totalCount } = await (await expectOk(await api.dam.files.$get({ query: { ...scope, folderId: folder.id } }))).json();
    expectEqual(totalCount, 0, "totalCount without archived");
    const [restored] = await (await expectOk(await api.dam.files.restore.$post({ json: { ids: [file.id] } }))).json();
    expectEqual(restored.archived, false, "archived");
});

await step("create a subfolder and download the folder as zip", async () => {
    await expectOk(await api.dam.folders.$post({ json: { name: "Subfolder", parentId: folder.id, scope } }));
    const response = await expectOk(await api.dam.folders[":id"].zip.$get({ param: { id: folder.id } }));
    expectEqual(response.headers.get("content-type"), "application/zip", "content-type");
});

await step("get the position of the file in the folder", async () => {
    const { position } = await (
        await expectOk(
            await api.dam.items.position.$get({ query: { ...scope, folderId: folder.id, id: file.id, type: "File", sortColumnName: "name" } }),
        )
    ).json();
    expectEqual(position, 1, "position (after the subfolder)");
});

await step("deny anonymous requests", async () => {
    expectEqual((await anonymousApi.dam.items.$get({ query: scope })).status, 401, "status");
});

await step("deny requests for a scope without permission", async () => {
    expectEqual((await api.dam.items.$get({ query: { domain: "forbidden" } })).status, 403, "status");
});

await step("reject invalid input", async () => {
    expectEqual((await api.dam.files[":id"].$get({ param: { id: "not-a-uuid" } })).status, 400, "status");
});

await step("delete the folder with its files", async () => {
    const { deleted } = await (await expectOk(await api.dam.folders[":id"].$delete({ param: { id: folder.id } }))).json();
    expectEqual(deleted, true, "deleted");
    expectEqual((await api.dam.files[":id"].$get({ param: { id: file.id } })).status, 404, "status of the deleted file");
    expectEqual((await fetch(`${baseUrl}${file.fileUrl}`)).status, 404, "status of the deleted file's URL");
});

if (failures > 0) {
    console.error(`\n${failures} step(s) failed`);
    process.exit(1);
}
console.info("\nAll steps passed");
