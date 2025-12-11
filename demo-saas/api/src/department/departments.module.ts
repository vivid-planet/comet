import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Department } from "./entities/department.entity";
import { DepartmentResolver } from "./generated/department.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([Department])],
    providers: [DepartmentResolver],
})
export class DepartmentsModule {}
