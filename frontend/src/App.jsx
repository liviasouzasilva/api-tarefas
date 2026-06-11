import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function TaskForm({ onSave, initial = { title: "", description: "" }, saving, onCancel }) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);

  useEffect(() => {
    setTitle(initial.title);
    setDescription(initial.description);
  }, [initial]);

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Título é obrigatório");
    onSave({ title: title.trim(), description: description.trim() || null });
    setTitle("");
    setDescription("");
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <label>
        <span>Título</span>
        <input
          type="text"
          placeholder="O que você precisa fazer?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        <span>Descrição</span>
        <textarea
          placeholder="Detalhes opcionais"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>
      <div className="form-actions">
        <button type="submit" disabled={saving} className="primary">
          {saving ? "Salvando..." : "Salvar tarefa"}
        </button>
        {onCancel ? (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}

function TaskItem({ task, onDelete, onToggle, onEdit }) {
  return (
    <div className={`task-card ${task.completed ? "done" : ""}`}>
      <div className="task-card-main">
        <button className="check" onClick={() => onToggle(task)} aria-label="Alternar conclusão">
          <span>{task.completed ? "✓" : ""}</span>
        </button>
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          {task.description ? <div className="task-description">{task.description}</div> : null}
        </div>
      </div>
      <div className="task-actions">
        <button className="ghost" onClick={() => onEdit(task)}>
          Editar
        </button>
        <button className="danger" onClick={() => onDelete(task)}>
          Excluir
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [notification, setNotification] = useState(null);
  const notificationTimeout = useRef(null);

  function notify(message, type = "success") {
    setNotification({ message, type });
    if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    notificationTimeout.current = setTimeout(() => setNotification(null), 2600);
  }

  useEffect(() => {
    fetchTasks();
    return () => {
      if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    };
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error("Erro ao buscar tarefas");
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveTask(payload) {
    setSaving(true);
    try {
      const url = editing ? `${API}/tasks/${editing.id}` : `${API}/tasks`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(editing ? "Falha ao atualizar" : "Falha ao criar");
      setEditing(null);
      await fetchTasks();
      notify(editing ? "Atualizado" : "Salvo", "success");
    } catch (e) {
      notify(e.message || "Erro ao salvar tarefa", "error");
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function deleteTask(id) {
    if (!confirm("Deseja realmente excluir esta tarefa?")) return;
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir");
      await fetchTasks();
      notify("Excluído", "success");
    } catch (e) {
      notify(e.message || "Erro ao excluir", "error");
      console.error(e);
    }
  }

  async function toggleCompleted(task) {
    try {
      await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      await fetchTasks();
      notify(`Tarefa ${!task.completed ? "concluída" : "marcada como pendente"}`, "success");
    } catch (e) {
      notify("Erro ao atualizar status", "error");
      console.error(e);
    }
  }

  const filteredTasks = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return tasks;
    return tasks.filter((task) => task.title.toLowerCase().includes(text) || (task.description || "").toLowerCase().includes(text));
  }, [tasks, query]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="app">
      {notification ? <div className={`toast ${notification.type}`}>{notification.message}</div> : null}
      <div className="page-header">
        <div>
          <span className="eyebrow">Gerenciador de tarefas</span>
          <h1>Organize seu dia com simplicidade</h1>
          <p>Crie, edite, exclua e marque tarefas como concluídas em poucos cliques.</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="label">Total</span>
            <strong>{tasks.length}</strong>
          </div>
          <div className="stat-card">
            <span className="label">Pendentes</span>
            <strong>{pendingCount}</strong>
          </div>
          <div className="stat-card">
            <span className="label">Concluídas</span>
            <strong>{completedCount}</strong>
          </div>
        </div>
      </div>

      <main>
        <section className="panel panel-form">
          <div className="panel-header">
            <div>
              <h2>{editing ? "Editar tarefa" : "Nova tarefa"}</h2>
              <p>{editing ? "Ajuste os detalhes e salve para atualizar." : "Use este formulário para adicionar uma nova tarefa."}</p>
            </div>
          </div>
          <TaskForm onSave={saveTask} initial={editing ?? undefined} saving={saving} onCancel={editing ? () => setEditing(null) : undefined} />
        </section>

        <section className="panel panel-list">
          <div className="panel-header space-between">
            <div>
              <h2>Lista de tarefas</h2>
              <p>Filtre e gerencie suas tarefas rápidas.</p>
            </div>
            <input
              className="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar tarefas..."
            />
          </div>

          {loading ? (
            <div className="empty-state">Carregando tarefas...</div>
          ) : error ? (
            <div className="empty-state error">{error}</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">Nenhuma tarefa encontrada.</div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={() => deleteTask(task.id)}
                  onToggle={toggleCompleted}
                  onEdit={() => setEditing(task)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer-note">
        <span>API backend: {API}</span>
      </footer>
    </div>
  );
}
