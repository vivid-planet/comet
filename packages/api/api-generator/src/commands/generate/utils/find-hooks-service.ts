import { type CrudGeneratorOptions } from "@comet/cms-api";
import { type EntityMetadata } from "@mikro-orm/core";
import { Node } from "ts-morph";

import { type Imports } from "./generate-imports-code";
import { findImportPath, morphTsClass } from "./ts-morph-helper";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findHooksService({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }) {
    if (!generatorOptions.hooksService) {
        return null;
    }
    let validateCreateInput = null;
    let validateUpdateInput = null;
    const imports: Imports = [];

    const tsClass = morphTsClass(metadata);
    for (const decorator of tsClass.getDecorators()) {
        if (decorator.getName() === "CrudGenerator") {
            const decoratorArgs = decorator.getArguments();
            if (decoratorArgs.length < 1) {
                throw new Error(`CrudGenerator decorator has no arguments`);
            }
            const firstArg = decoratorArgs[0];
            if (!Node.isObjectLiteralExpression(firstArg)) {
                throw new Error("CrudGenerator decorator first argument is not an object literal");
            }
            const hooksServiceProp = firstArg.getProperty("hooksService");
            if (!hooksServiceProp) {
                throw new Error("hooksService property not found in CrudGenerator decorator");
            }
            if (!Node.isPropertyAssignment(hooksServiceProp)) {
                throw new Error("hooksService property is not a property assignment");
            }
            const initializer = hooksServiceProp.getInitializer();
            if (!initializer) {
                throw new Error("hooksService initializer not found");
            }
            if (!Node.isIdentifier(initializer)) {
                throw new Error("hooksService initializer is not an identifier");
            }
            const hooksServiceClassName = initializer.getText();
            const { importPath } = findImportPath(hooksServiceClassName, generatorOptions.targetDirectory, metadata);
            if (importPath) {
                imports.push({ name: hooksServiceClassName, importPath });
            }

            const serviceClassRef = initializer.getSymbolOrThrow();
            const serviceClassDeclaration = (serviceClassRef.getAliasedSymbol() ?? serviceClassRef).getDeclarations().find(Node.isClassDeclaration);
            if (!serviceClassDeclaration) {
                throw new Error("hooksService class declaration not found");
            }

            for (const method of serviceClassDeclaration.getMethods()) {
                if (method.getName() == "validateCreateInput") {
                    validateCreateInput = {};
                    const parameters = method.getParameters();
                    if (parameters.length >= 2) {
                        //has options
                        const options = parameters[1]
                            .getType()
                            .getProperties()
                            .map((prop) => prop.getName());

                        validateCreateInput = {
                            options,
                        };
                    } else {
                        validateCreateInput = {};
                    }
                } else if (method.getName() == "validateUpdateInput") {
                    validateUpdateInput = {};
                    const parameters = method.getParameters();
                    if (parameters.length >= 2) {
                        //has options
                        const options = parameters[1]
                            .getType()
                            .getProperties()
                            .map((prop) => prop.getName());

                        validateUpdateInput = {
                            options,
                        };
                    } else {
                        validateUpdateInput = {};
                    }
                }
            }

            return {
                validateCreateInput,
                validateUpdateInput,
                imports,
                className: hooksServiceClassName,
            };
        }
    }
    throw new Error("CrudGenerator decorator not found");
}
