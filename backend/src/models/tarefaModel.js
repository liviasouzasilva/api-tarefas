// Modelo de dados utilizando Prisma (persistência no banco)
import { prisma } from "../config/prisma.js";

function mapPrismaToApi(task) {
  if (!task) return null;
  return {
    id: task.id,
    descricao: task.title,
    concluida: task.completed,
    createdAt: task.createdAt
  };
}

export async function obterTodasTarefas() {
  const tasks = await prisma.task.findMany({ orderBy: { id: "asc" } });
  return tasks.map(mapPrismaToApi);
}

export async function obterTarefaPorId(id) {
  const task = await prisma.task.findUnique({ where: { id } });
  return mapPrismaToApi(task);
}

export async function criarNovaTarefa(descricao) {
  const trimmed = descricao.trim();
  const created = await prisma.task.create({ data: { title: trimmed } });
  return mapPrismaToApi(created);
}

export async function atualizarTarefa(id, novaDescricao, novoStatus) {
  const data = {};
  if (novaDescricao !== undefined) data.title = novaDescricao.trim();
  if (novoStatus !== undefined) data.completed = novoStatus;

  // Verifica existência
  const exists = await prisma.task.findUnique({ where: { id } });
  if (!exists) return null;

  const updated = await prisma.task.update({ where: { id }, data });
  return mapPrismaToApi(updated);
}

export async function excluirTarefa(id) {
  const exists = await prisma.task.findUnique({ where: { id } });
  if (!exists) return null;
  const deleted = await prisma.task.delete({ where: { id } });
  return mapPrismaToApi(deleted);
}
