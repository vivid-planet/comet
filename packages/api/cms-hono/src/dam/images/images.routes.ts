import { type Context, Hono } from "hono";
import { z } from "zod";

import { requirePermission } from "../../core/auth.js";
import { badRequest, notFound } from "../../core/errors.js";
import { zValidator } from "../../core/validator.js";
import { focalPoints } from "../common/focal-point.js";
import { isValidHash } from "../common/http.util.js";
import type { DamEnv, DamRouteContext, DamRouteHelpers, DamScopeSchema } from "../dam.context.js";
import type { DamFile } from "../dam.types.js";
import type { ImageParams } from "./images.service.js";

const publicCacheControl = "max-age=31536000, s-maxage=86400, public";
const privateCacheControl = "max-age=31536000, private";

const percentage = z.coerce.number().min(0).max(100);

/** `crop:SMART` or `crop:<width>:<height>:<focalPoint>:<x>:<y>` */
const cropSegment = z.string().transform((value, ctx) => {
    const [prefix, ...parts] = value.split(":");
    if (prefix === "crop" && parts.length === 1 && parts[0] === "SMART") {
        return { focalPoint: "SMART" as const };
    }
    const focus = z
        .tuple([percentage, percentage, z.enum(focalPoints).exclude(["SMART"]), percentage, percentage])
        .safeParse(prefix === "crop" ? parts : []);
    if (!focus.success) {
        ctx.addIssue({ code: "custom", message: "Invalid crop" });
        return z.NEVER;
    }
    const [width, height, focalPoint, x, y] = focus.data;
    return { focalPoint, width, height, x, y };
});

/** `resize:<width>:<height>` */
const resizeSegment = z
    .string()
    .regex(/^resize:\d+:\d+$/)
    .transform((value) => {
        const [, width, height] = value.split(":").map(Number);
        return { resizeWidth: width, resizeHeight: height };
    });

const imageUrlParams = z.object({
    contentHash: z.string().regex(/^[0-9a-f]{32}$/),
    fileId: z.uuid(),
    crop: cropSegment,
    resize: resizeSegment,
    filename: z.string(),
});

export function createImagesRoutes<TScopeSchema extends DamScopeSchema>(
    _context: DamRouteContext<TScopeSchema>,
    helpers: DamRouteHelpers<TScopeSchema>,
) {
    function toImageParams({ fileId, filename, crop, resize }: z.output<typeof imageUrlParams>): ImageParams {
        return { fileId, filename, cropArea: crop, ...resize };
    }

    async function respondWithCroppedImage(c: Context<DamEnv>, file: DamFile, params: ImageParams, cacheControl: string): Promise<Response> {
        if (!c.var.dam.images.isAllowedImageSize(params.resizeWidth)) {
            throw badRequest("resizeWidth is not allowed");
        }
        if (!c.var.dam.images.isValidAspectRatio(file, params)) {
            throw badRequest("Aspect ratio is invalid");
        }

        const response = await c.var.dam.images.fetchCroppedImage(file, params, c.req.header("accept") ?? "");
        const headers = new Headers({ "cache-control": cacheControl, vary: "Accept" });
        for (const header of ["content-type", "content-length"]) {
            const value = response.headers.get(header);
            if (value) {
                headers.set(header, value);
            }
        }
        return new Response(response.body, { status: response.status, headers });
    }

    async function findImageOrFail(c: Context<DamEnv>, { fileId, contentHash }: { fileId: string; contentHash: string }): Promise<DamFile> {
        const file = await c.var.dam.files.findOneById(fileId);
        if (!file?.image) {
            throw notFound();
        }
        if (file.contentHash !== contentHash) {
            throw badRequest("Content Hash mismatch!");
        }
        return file;
    }

    return new Hono<DamEnv>()
        .get("/preview/:contentHash/:fileId/:crop/:resize/:filename", requirePermission("dam"), zValidator("param", imageUrlParams), async (c) => {
            const params = c.req.valid("param");
            const file = await findImageOrFail(c, params);
            helpers.assertScopeAllowed(c, file.scope);
            return respondWithCroppedImage(c, file, toImageParams(params), privateCacheControl);
        })
        .get(
            "/:hash{[0-9a-f]{40}}/:contentHash/:fileId/:crop/:resize/:filename",
            zValidator("param", imageUrlParams.extend({ hash: z.string() })),
            async (c) => {
                const { hash, ...urlParams } = c.req.valid("param");
                const params = toImageParams(urlParams);
                if (!isValidHash(hash, c.var.dam.images.createHash(params))) {
                    throw badRequest("Invalid hash");
                }
                const file = await findImageOrFail(c, urlParams);
                if (c.var.dam.images.shouldRedirectToCurrentUrl(file, params.filename)) {
                    c.header("cache-control", publicCacheControl);
                    return c.redirect(c.var.dam.images.createUrl(file, params), 301);
                }
                return respondWithCroppedImage(c, file, params, publicCacheControl);
            },
        );
}
