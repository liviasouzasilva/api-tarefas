// ========================================
// CONTROLLER - CAMADA DE CONTROLE
// ========================================
// Esta camada é responsável por:
// - Receber as requisições HTTP
// - Validar os dados recebidos
// - Chamar os métodos do Model
// - Retornar as respostas adequadas

import * as TarefaModel from "../models/tarefaModel.js";

/**
 * Retorna todas as tarefas em formato JSON
 * @route GET /tarefas
 */
export async function listarTarefas(req, res) {
  try {
    const tarefas = await TarefaModel.obterTodasTarefas();
    res.json(tarefas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar tarefas" });
  }
}

/**
 * Retorna uma tarefa específica com base no id enviado na URL
 * @route GET /tarefas/:id
 */
export async function obterTarefa(req, res) {
  const idNumero = Number(req.params.id);
  if (Number.isNaN(idNumero)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const tarefa = await TarefaModel.obterTarefaPorId(idNumero);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json(tarefa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao obter tarefa" });
  }
}

/**
 * Cria uma nova tarefa
 * @route POST /tarefas
 */
export async function criarTarefa(req, res) {
  const { descricao } = req.body;
  if (typeof descricao !== "string" || descricao.trim() === "") {
    return res.status(400).json({ erro: "Descrição é obrigatória" });
  }

  try {
    const tarefaCriada = await TarefaModel.criarNovaTarefa(descricao);
    res.status(201).json({ mensagem: "Tarefa criada com sucesso!", tarefa: tarefaCriada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar tarefa" });
  }
}

/**
 * Atualiza parcialmente uma tarefa existente
 * @route PATCH /tarefas/:id
 */
export async function atualizarTarefa(req, res) {
  const idNumero = Number(req.params.id);
  const { descricao, concluida } = req.body;

  if (Number.isNaN(idNumero)) return res.status(400).json({ erro: "ID inválido" });

  if (descricao !== undefined && (typeof descricao !== "string" || descricao.trim() === ""))
    return res.status(400).json({ erro: "Descrição inválida" });

  if (concluida !== undefined && typeof concluida !== "boolean")
    return res.status(400).json({ erro: "concluida deve ser boolean" });

  try {
    const tarefaAtualizada = await TarefaModel.atualizarTarefa(idNumero, descricao, concluida);
    if (!tarefaAtualizada) return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json({ mensagem: "Tarefa atualizada com sucesso!", tarefa: tarefaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
}

/**
 * Remove uma tarefa pelo id
 * @route DELETE /tarefas/:id
 */
export async function excluirTarefa(req, res) {
  const idNumero = Number(req.params.id);
  if (Number.isNaN(idNumero)) return res.status(400).json({ erro: "ID inválido" });

  try {
    const tarefaRemovida = await TarefaModel.excluirTarefa(idNumero);
    if (!tarefaRemovida) return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json({ mensagem: "Tarefa excluída com sucesso!", tarefa: tarefaRemovida });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir tarefa" });
  }
}
