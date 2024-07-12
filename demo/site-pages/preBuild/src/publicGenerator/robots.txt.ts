import fs from "fs";

import createPublicGeneratedDirectory from "./createPublicGeneratedDirectory";

const robotsTxt = () => {
    const generatedDirectory = createPublicGeneratedDirectory();

    const robots = `User-agent: * 
Sitemap: ${process.env.SITE_URL}/sitemap.xml`;
    const filePath = `${generatedDirectory}robots.txt`;
    fs.writeFileSync(filePath, robots);
    console.log(`✅ Successfully created robots.txt: ${filePath}`);
};

export default robotsTxt;
