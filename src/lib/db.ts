import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const db =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: ["error"],
  });

globalThis.prismaGlobal = db;

