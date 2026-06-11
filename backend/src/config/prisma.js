import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Prisma: conexão com o banco bem-sucedida.");
  } catch (error) {
    console.error("Prisma: erro ao conectar ao banco:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { prisma, testConnection };