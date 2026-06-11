import * as mariadb from 'mariadb';

async function createDB() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      port: 3306
    });

    await conn.query("CREATE DATABASE IF NOT EXISTS tarefas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    console.log('Banco de dados `tarefas_db` criado ou já existente.');
  } catch (err) {
    console.error('Erro ao criar banco de dados:', err);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

createDB();
