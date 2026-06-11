async function run() {
  const BASE = 'http://localhost:3000';
  try {
    console.log('1) Criando tarefa...');
    let res = await fetch(`${BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Tarefa de teste', description: 'Criada por script' })
    });
    if (res.status !== 201) throw new Error('POST /tasks falhou: ' + res.status);
    const created = await res.json();
    console.log('Criado:', created.registro);
    const id = created.registro.id;

    console.log('2) Listando tarefas...');
    res = await fetch(`${BASE}/tasks`);
    if (!res.ok) throw new Error('GET /tasks falhou');
    const list = await res.json();
    console.log('Total tarefas:', list.length);

    console.log('3) Atualizando título...');
    res = await fetch(`${BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Tarefa atualizada' })
    });
    if (!res.ok) throw new Error('PUT /tasks/:id falhou');
    console.log('Atualizado:', await res.json());

    console.log('4) Alternando `completed`...');
    res = await fetch(`${BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    });
    if (!res.ok) throw new Error('PUT completed falhou');
    console.log('Tarefa marcada como concluída.');

    console.log('5) Excluindo tarefa...');
    res = await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('DELETE /tasks/:id falhou');
    console.log('Excluída:', await res.json());

    console.log('6) Verificando remoção...');
    res = await fetch(`${BASE}/tasks/${id}`);
    if (res.status !== 404) throw new Error('Registro ainda existe ou erro inesperado: ' + res.status);

    console.log('Todos os testes CRUD passaram com sucesso.');
    process.exit(0);
  } catch (err) {
    console.error('Erro nos testes:', err);
    process.exit(1);
  }
}

run();
