import { handlePreviewApiRequest } from "@comet/cms-site";

export default async function handler(req, res) {
    handlePreviewApiRequest(req, res);
}
