import type { SitePreviewParams } from "@src/futureLib/previewUtils";
import { AsyncLocalStorage } from "async_hooks";

export const sitePreviewParamsStorage = new AsyncLocalStorage<SitePreviewParams>();
