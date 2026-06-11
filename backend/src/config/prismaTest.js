import { testConnection } from "./prisma.js";

(async () => {
  try {
    await testConnection();
    console.log("Teste de conexão finalizado com sucesso.");
  } catch (e) {
    console.error("Teste de conexão falhou.");
    process.exit(1);
  }
})();
