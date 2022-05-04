/* eslint-disable no-undef */
const express = require("express");
var pm2 = require("pm2");

const port = process.env.NEXT_SERVER_INTERNAL_API_PORT || 9000;

async function bootstrap() {
    await new Promise((resolve) => {
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(2);
            }

            resolve();
        });
    });

    const app = express();

    app.get("/status/health", (req, res) => res.send("OK"));

    app.get("/restart", async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                pm2.reload("next-server", (err, proc) => {
                    if (err) {
                        reject();
                    }
                    resolve();
                });
            });
        } catch (err) {
            res.status(500).send("Next Server couldn't be restartet");
            return;
        }

        res.send("Next Server successfully reloaded");
    });

    app.listen(port, () => console.log(`Next Server Internal API listening at http://localhost:${port}`));
}
bootstrap();
