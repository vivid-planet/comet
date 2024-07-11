import robotsTxt from "./robots.txt";
import sitemapXml from "./sitemap.xml";

const main = () => {
    // create static files before next build
    robotsTxt();
    sitemapXml();
};

main();
