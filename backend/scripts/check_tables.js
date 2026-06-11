import * as mariadb from 'mariadb';

async function check() {
  let conn;
  try {
    conn = await mariadb.createConnection({ host: '127.0.0.1', user: 'root', password: '', port: 3306, database: 'tarefas_db' });
    const rows = await conn.query("SHOW TABLES;");
    console.log(rows);
  } catch (err) {
    console.error('Erro ao verificar tabelas:', err);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

check();
