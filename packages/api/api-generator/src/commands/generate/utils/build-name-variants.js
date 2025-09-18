"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNameVariants = buildNameVariants;
var pluralize_1 = require("pluralize");
function classNameToInstanceName(className) {
    return className[0].toLocaleLowerCase() + className.slice(1);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildNameVariants(metadata) {
    var classNameSingular = metadata.className;
    var classNamePlural = (0, pluralize_1.plural)(metadata.className);
    var instanceNameSingular = classNameToInstanceName(classNameSingular);
    var instanceNamePlural = classNameToInstanceName(classNamePlural);
    var fileNameSingular = instanceNameSingular.replace(/[A-Z]/g, function (i) { return "-".concat(i.toLocaleLowerCase()); });
    var fileNamePlural = instanceNamePlural.replace(/[A-Z]/g, function (i) { return "-".concat(i.toLocaleLowerCase()); });
    return {
        classNameSingular: classNameSingular,
        classNamePlural: classNamePlural,
        instanceNameSingular: instanceNameSingular,
        instanceNamePlural: instanceNamePlural,
        fileNameSingular: fileNameSingular,
        fileNamePlural: fileNamePlural,
    };
}
