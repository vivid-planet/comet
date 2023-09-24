import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Book } from "@src/books/entities/book.entity";
import { BookResolver } from "@src/books/generated/book.resolver";
import { BooksService } from "@src/books/generated/books.service";

@Module({
    imports: [MikroOrmModule.forFeature([Book])],
    providers: [BookResolver, BooksService],
    exports: [],
})
export class BooksModule {}
