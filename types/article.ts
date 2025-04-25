import { Category, Download, Article as PrismaArticle, Tag, User } from "@prisma/client";

export type Article = PrismaArticle & {
  category?: Category;
  tag?: Tag[];
  author?: User;
  download?: Download[];
}