import * as TaskModel from "../models/taskModel.js";

export async function listar(req, res) {
  try {
    const items = await TaskModel.listar();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar registros" });
  }
}

export async function buscarPorId(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  try {
    const item = await TaskModel.buscarPorId(id);
    if (!item) return res.status(404).json({ erro: "Registro não encontrado" });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar registro" });
  }
}

export async function criar(req, res) {
  const { title, description, completed } = req.body;
  if (typeof title !== "string" || title.trim() === "")
    return res.status(400).json({ erro: "Campo 'title' é obrigatório" });

  try {
    const created = await TaskModel.criar({ title: title.trim(), description, completed });
    res.status(201).json({ mensagem: "Criado com sucesso", registro: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar registro" });
  }
}

export async function atualizar(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  const { title, description, completed } = req.body;
  const payload = {};
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "")
      return res.status(400).json({ erro: "Campo 'title' inválido" });
    payload.title = title.trim();
  }
  if (description !== undefined) payload.description = description;
  if (completed !== undefined && typeof completed !== "boolean")
    return res.status(400).json({ erro: "Campo 'completed' deve ser boolean" });
  if (completed !== undefined) payload.completed = completed;

  try {
    const updated = await TaskModel.atualizar(id, payload);
    if (!updated) return res.status(404).json({ erro: "Registro não encontrado" });
    res.json({ mensagem: "Atualizado com sucesso", registro: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar registro" });
  }
}

export async function excluir(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

  try {
    const removed = await TaskModel.excluir(id);
    if (!removed) return res.status(404).json({ erro: "Registro não encontrado" });
    res.json({ mensagem: "Removido com sucesso", registro: removed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao remover registro" });
  }
}
