import express from "express";
import { tarefas } from "./dados.js";

const app = express();
const PORTA = 3000;

// Permitir receber JSON no corpo da requisição
app.use(express.json());

/*
GET /tarefas
Lista todas as tarefas
*/
app.get("/tarefas", (req, res) => {
  res.status(200).json(tarefas);
});

/*
POST /tarefas
Cria uma nova tarefa
*/
app.post("/tarefas", (req, res) => {
  const { titulo } = req.body;

  // Validação mínima
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

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});