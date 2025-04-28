import { Comment as PrismaComment, User } from "@prisma/client";

export type Comment = PrismaComment & {
  author: User;
};