import { Transform } from "jscodeshift";

const transform: Transform = (file, api, options) => {
    const j = api.jscodeshift;
    const root = j(file.source);

    const muiCoreImports = root.find(j.ImportDeclaration).filter((impDecNodePath) => impDecNodePath.value.source.value === "@material-ui/core");

    const cometAdminImports = root.find(j.ImportDeclaration).filter((impDecNodePath) => impDecNodePath.value.source.value === "@comet/admin");
    cometAdminImports.forEach((impDecNodePathFiltered) => {
        const imports = j(impDecNodePathFiltered).find(j.ImportSpecifier);
        imports.forEach((impSpecNodePath) => {
            if (impSpecNodePath.node.imported.name === "createMuiTheme") {
                if (muiCoreImports.length) {
                    muiCoreImports.forEach((imp) => {
                        imp.value.specifiers.push(j.importSpecifier(j.identifier("createMuiTheme")));
                    });
                } else {
                    j(impDecNodePathFiltered).insertAfter(
                        j.importDeclaration([j.importSpecifier(j.identifier("createMuiTheme"))], j.stringLiteral("@material-ui/core")),
                    );
                }

                if (imports.length === 1) {
                    j(impDecNodePathFiltered).remove();
                } else {
                    j(impSpecNodePath).remove();
                }
            }
        });
    });

    return root.toSource();
};

export default transform;
