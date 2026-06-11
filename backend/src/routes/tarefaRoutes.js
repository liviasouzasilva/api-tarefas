// ========================================
// ROUTES - CAMADA DE ROTAS
// ========================================
// Esta camada é responsável por:
// - Definir as rotas da aplicação
// - Mapear URLs para os controllers correspondentes
// - Organizar as rotas por recurso/entidade

import express from "express";
import * as TaskController from "../controllers/taskController.js";

// Cria um roteador do Express
const router = express.Router();

// ========================================
// DEFINIÇÃO DAS ROTAS DE TAREFAS
// ========================================

// GET /tasks - lista todos
router.get("/tasks", TaskController.listar);

// GET /tasks/:id - busca por id
router.get("/tasks/:id", TaskController.buscarPorId);

// POST /tasks - cria
router.post("/tasks", TaskController.criar);

// PUT /tasks/:id - atualiza (substituição parcial/total aceita)
router.put("/tasks/:id", TaskController.atualizar);

// DELETE /tasks/:id - remove
router.delete("/tasks/:id", TaskController.excluir);

// Exporta o roteador para ser usado no app principal
export default router;
