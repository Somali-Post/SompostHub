import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  adapter?: PrismaPg;
  pool?: Pool;
};

const databaseUrl = process.env.DATABASE_URL;

const createMissingDatabaseProxy = () =>
  new Proxy(
    {},
    {
      get() {
        throw new Error("DATABASE_URL is not set");
      },
    }
  );

const pool = databaseUrl ? globalForPrisma.pool ?? new Pool({ connectionString: databaseUrl }) : null;
const adapter = databaseUrl && pool ? globalForPrisma.adapter ?? new PrismaPg(pool) : null;

export const prisma =
  globalForPrisma.prisma ??
  (databaseUrl ? new PrismaClient({ adapter: adapter! }) : (createMissingDatabaseProxy() as PrismaClient));

if (process.env.NODE_ENV !== "production" && databaseUrl) {
  globalForPrisma.prisma = prisma;
  globalForPrisma.adapter = adapter ?? undefined;
  globalForPrisma.pool = pool ?? undefined;
}

export default prisma;
