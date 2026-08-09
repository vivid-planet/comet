import { DynamicModule, Module, Type } from "@nestjs/common";

import { DependentsResolverFactory } from "..";
import { FileInterface } from "./files/entities/file.entity";

interface DamDependentsModuleOptions {
    File: Type<FileInterface>;
}

@Module({})
export class DamDependentsModule {
    static register({ File }: DamDependentsModuleOptions): DynamicModule {
        return {
            module: DamDependentsModule,
            providers: [DependentsResolverFactory.create(File)],
        };
    }
}
