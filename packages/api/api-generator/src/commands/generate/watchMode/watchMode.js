"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchMode = void 0;
var node_console_1 = require("node:console");
var child_process_1 = require("child_process");
var chokidar_1 = require("chokidar");
var handleChildProcess_1 = require("./handleChildProcess");
var waitForExit = function (proc) {
    return new Promise(function (resolve) {
        proc.on("exit", function (code, signal) {
            resolve({ code: code, signal: signal });
        });
    });
};
/**
 * Watch mode for the generator.
 *
 * Watches the `src` directory for changes and triggers child processes of generator for the changed file, to process it.
 */
var watchMode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var childProcesses;
    return __generator(this, function (_a) {
        childProcesses = {};
        (0, chokidar_1.watch)("./src", {
            awaitWriteFinish: {
                stabilityThreshold: 300,
                pollInterval: 200,
            },
            ignored: function (path, stats) {
                if (stats === null || stats === void 0 ? void 0 : stats.isFile()) {
                    return !path.endsWith(".entity.ts");
                }
                return false;
            },
        })
            .on("change", function (path) { return __awaiter(void 0, void 0, void 0, function () {
            var childProcess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node_console_1.default.log("\uD83D\uDE80 File changed: ".concat(path));
                        if (!childProcesses[path]) return [3 /*break*/, 3];
                        if (!(childProcesses[path].exitCode == null)) return [3 /*break*/, 2];
                        childProcesses[path].kill();
                        return [4 /*yield*/, waitForExit(childProcesses[path])];
                    case 1:
                        _a.sent();
                        node_console_1.default.log("💀 Killed running process for file: ", path);
                        _a.label = 2;
                    case 2:
                        delete childProcesses[path];
                        _a.label = 3;
                    case 3:
                        childProcess = (0, child_process_1.spawn)("node ".concat(__dirname, "/../../../../bin/api-generator.js generate -f ").concat(path), {
                            shell: true,
                        });
                        childProcesses[path] = childProcess;
                        try {
                            (0, handleChildProcess_1.handleChildProcess)(childProcess);
                        }
                        catch (e) {
                            node_console_1.default.error("\u274C Error processing ".concat(path, " with error: ").concat(e));
                        }
                        return [2 /*return*/];
                }
            });
        }); })
            .on("error", function (error) {
            node_console_1.default.error("Watcher error: ".concat(error));
        });
        return [2 /*return*/];
    });
}); };
exports.watchMode = watchMode;
