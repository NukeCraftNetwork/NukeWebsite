import { PrismaClient } from "@prisma/client";
import { isAbsolute, join } from "path";

function resolveRelativeDatasourceUrl(url: string) {
  "use server";
  const FILE_INDICATOR = "file:";
  if (!url.startsWith(FILE_INDICATOR)) {
    return url;
  }
  const rawUrl = url.replaceAll(FILE_INDICATOR, "");
  if (isAbsolute(rawUrl)) return rawUrl;
  return FILE_INDICATOR + join(process.cwd(), "prisma", rawUrl);
}

let prisma: PrismaClient | null = null;
export function usePrisma() {
  if (prisma) return prisma;
  prisma = new PrismaClient({
    datasourceUrl: resolveRelativeDatasourceUrl(process.env["DATABASE_URL"]!),
  });
  return prisma;
}
