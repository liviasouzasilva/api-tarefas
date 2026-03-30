import express from "express";
import { tarefas } from "./dados.js";

const app = express();
const PORTA = 3000;

// Middleware
app.use(express.json());

/*
GET /tarefas
*/
app.get("/tarefas", (req, res) => {
  res.status(200).json(tarefas);
});

/*
POST /tarefas
*/
app.post("/tarefas", (req, res) => {
  const { titulo } = req.body;

  if (!titulo || titulo.trim() === "") {
    return res.status(400).json({
      erro: "Título é obrigatório."
    });
  }

  const novaTarefa = {
    id: tarefas.length + 1,
    titulo,
    concluida: false
  };

  tarefas.push(novaTarefa);

  res.status(201).json(novaTarefa);
});

/*
PATCH /tarefas/:id
*/
app.patch("/tarefas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, concluida } = req.body;

  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  if (titulo !== undefined) tarefa.titulo = titulo;
  if (concluida !== undefined) tarefa.concluida = concluida;

  res.json(tarefa);
});

/*
DELETE /tarefas/:id
*/
app.delete("/tarefas/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = tarefas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  tarefas.splice(index, 1);

  res.status(204).send();
});

// START
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});