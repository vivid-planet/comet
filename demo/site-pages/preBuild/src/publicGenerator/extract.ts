import fs from "fs-extra";

import createPublicGeneratedDirectory from "./createPublicGeneratedDirectory";

const main = async () => {
    const generatedDirectory = createPublicGeneratedDirectory();
    const targetDirectory = `./public/`;

    fs.readdir(generatedDirectory, (err, files) => {
        files.forEach((file) => {
            const sourcePath = `${generatedDirectory}${file}`;
            const targetPath = `${targetDirectory}${file}`;

            const stats = fs.statSync(sourcePath); // get stats to evalute if path is directory or file

            if (stats.isDirectory()) {
                fs.copy(sourcePath, targetPath, (err) => {
                    if (err) {
                        console.log(`⛔️ error extracting directory ${targetPath}`);
                        throw err;
                    }
                    console.log(`✅ successfully extracted directory ${targetPath}`);
                });
            } else {
                fs.copyFile(sourcePath, targetPath, (err) => {
                    if (err) {
                        console.log(`⛔️ error extracting file ${targetPath}`);
                        throw err;
                    }
                    console.log(`✅ successfully extracted file ${targetPath}`);
                });
            }
        });
    });
};

main();
