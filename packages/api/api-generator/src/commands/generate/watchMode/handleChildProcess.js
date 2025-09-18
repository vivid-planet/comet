"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChildProcess = handleChildProcess;
function handleChildProcess(child) {
    return new Promise(function (resolve, reject) {
        var scriptOutput = "";
        var errorOutput = "";
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function (data) {
            scriptOutput += data;
            console.log(data);
        });
        child.stderr.on("data", function (data) {
            errorOutput += data;
            console.error(data);
        });
        child.on("close", function (code) {
            if (code !== 0) {
                reject(errorOutput);
            }
            else {
                resolve(scriptOutput);
            }
        });
    });
}
