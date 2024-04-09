import { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${process.env.SITE_URL}/sitemap.xml`, // TODO support multiple site domains
    };
}
