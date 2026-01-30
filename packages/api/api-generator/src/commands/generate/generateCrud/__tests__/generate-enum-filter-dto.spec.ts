//import { parseSource } from "../../utils/test-helper";
import { generateEnumFilterDto } from "../generate-enum-filter-dto";

describe("generateEnumFilterDto", () => {
    describe("path", () => {
        it("should generate filter at same path where enum is located", () => {
            const result = generateEnumFilterDto("enum", "Status", "src/products/product");

            expect(result.name).toBe("dto/product.enum-filter.ts");
            expect(result.type).toBe("enum-filter");
            expect(result.targetDirectory).toBe("src/products/generated");
        });

        it("should exclude entities in path", () => {
            const result = generateEnumFilterDto("enum", "Status", "src/products/entities/product");

            expect(result.name).toBe("dto/product.enum-filter.ts");
            expect(result.type).toBe("enum-filter");
            expect(result.targetDirectory).toBe("src/products/generated");
        });

        it("should strip enum from path to avoid duplicating enum", () => {
            const result = generateEnumFilterDto("enum", "Status", "src/products/entities/status.enum");

            expect(result.name).toBe("dto/status.enum-filter.ts");
            expect(result.type).toBe("enum-filter");
            expect(result.targetDirectory).toBe("src/products/generated");
        });
    });
});
