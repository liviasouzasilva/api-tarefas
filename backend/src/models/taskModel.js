import { prisma } from "../config/prisma.js";
import { Prisma } from "@prisma/client";

function mapPrismaToApi(task) {
  if (!task) return null;
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? null,
    completed: task.completed,
    createdAt: task.createdAt
  };
}

export async function listar() {
  const tasks = await prisma.task.findMany({ orderBy: { id: "asc" } });
  return tasks.map(mapPrismaToApi);
}

export async function buscarPorId(id) {
  const task = await prisma.task.findUnique({ where: { id } });
  return mapPrismaToApi(task);
}

export async function criar(data) {
  const payload = {
    title: data.title,
    description: data.description ?? null,
    completed: data.completed ?? false
  };
  const created = await prisma.task.create({ data: payload });
  return mapPrismaToApi(created);
}

export async function atualizar(id, data) {
  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.completed !== undefined) updateData.completed = data.completed;

  try {
    const updated = await prisma.task.update({ where: { id }, data: updateData });
    return mapPrismaToApi(updated);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null;
    }
    throw error;
  }
}

export async function excluir(id) {
  try {
    const deleted = await prisma.task.delete({ where: { id } });
    return mapPrismaToApi(deleted);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null;
    }
    throw error;
  }
}
