import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertTurmaSchema,
  insertProfessorSchema,
  insertDisciplinaSchema,
  insertAlunoSchema,
  insertProfessorDisciplinaTurmaSchema,
  insertNotaSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/turmas", async (req, res) => {
    const turmas = await storage.getTurmas();
    res.json(turmas);
  });

  app.get("/api/turmas/:id", async (req, res) => {
    const turma = await storage.getTurma(parseInt(req.params.id));
    if (!turma) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }
    res.json(turma);
  });

  app.post("/api/turmas", async (req, res) => {
    const result = insertTurmaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const turma = await storage.createTurma(result.data);
    res.status(201).json(turma);
  });

  app.put("/api/turmas/:id", async (req, res) => {
    const result = insertTurmaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const turma = await storage.updateTurma(parseInt(req.params.id), result.data);
    if (!turma) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }
    res.json(turma);
  });

  app.delete("/api/turmas/:id", async (req, res) => {
    await storage.deleteTurma(parseInt(req.params.id));
    res.status(204).send();
  });

  app.get("/api/professores", async (req, res) => {
    const professores = await storage.getProfessores();
    res.json(professores);
  });

  app.get("/api/professores/:id", async (req, res) => {
    const professor = await storage.getProfessor(parseInt(req.params.id));
    if (!professor) {
      return res.status(404).json({ message: "Professor não encontrado" });
    }
    res.json(professor);
  });

  app.post("/api/professores", async (req, res) => {
    const result = insertProfessorSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const professor = await storage.createProfessor(result.data);
    res.status(201).json(professor);
  });

  app.put("/api/professores/:id", async (req, res) => {
    const result = insertProfessorSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const professor = await storage.updateProfessor(parseInt(req.params.id), result.data);
    if (!professor) {
      return res.status(404).json({ message: "Professor não encontrado" });
    }
    res.json(professor);
  });

  app.delete("/api/professores/:id", async (req, res) => {
    await storage.deleteProfessor(parseInt(req.params.id));
    res.status(204).send();
  });

  app.get("/api/disciplinas", async (req, res) => {
    const disciplinas = await storage.getDisciplinas();
    res.json(disciplinas);
  });

  app.get("/api/disciplinas/:id", async (req, res) => {
    const disciplina = await storage.getDisciplina(parseInt(req.params.id));
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada" });
    }
    res.json(disciplina);
  });

  app.post("/api/disciplinas", async (req, res) => {
    const result = insertDisciplinaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const disciplina = await storage.createDisciplina(result.data);
    res.status(201).json(disciplina);
  });

  app.put("/api/disciplinas/:id", async (req, res) => {
    const result = insertDisciplinaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const disciplina = await storage.updateDisciplina(parseInt(req.params.id), result.data);
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada" });
    }
    res.json(disciplina);
  });

  app.delete("/api/disciplinas/:id", async (req, res) => {
    await storage.deleteDisciplina(parseInt(req.params.id));
    res.status(204).send();
  });

  app.get("/api/alunos", async (req, res) => {
    const alunos = await storage.getAlunos();
    res.json(alunos);
  });

  app.get("/api/alunos/:id", async (req, res) => {
    const aluno = await storage.getAluno(parseInt(req.params.id));
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    res.json(aluno);
  });

  app.post("/api/alunos", async (req, res) => {
    const result = insertAlunoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const aluno = await storage.createAluno(result.data);
    res.status(201).json(aluno);
  });

  app.put("/api/alunos/:id", async (req, res) => {
    const result = insertAlunoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const aluno = await storage.updateAluno(parseInt(req.params.id), result.data);
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    res.json(aluno);
  });

  app.delete("/api/alunos/:id", async (req, res) => {
    await storage.deleteAluno(parseInt(req.params.id));
    res.status(204).send();
  });

  app.get("/api/associacoes", async (req, res) => {
    const associacoes = await storage.getAssociacoes();
    res.json(associacoes);
  });

  app.get("/api/associacoes/:id", async (req, res) => {
    const associacao = await storage.getAssociacao(parseInt(req.params.id));
    if (!associacao) {
      return res.status(404).json({ message: "Associação não encontrada" });
    }
    res.json(associacao);
  });

  app.post("/api/associacoes", async (req, res) => {
    const result = insertProfessorDisciplinaTurmaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const associacao = await storage.createAssociacao(result.data);
    res.status(201).json(associacao);
  });

  app.delete("/api/associacoes/:id", async (req, res) => {
    await storage.deleteAssociacao(parseInt(req.params.id));
    res.status(204).send();
  });

  app.get("/api/notas", async (req, res) => {
    const notas = await storage.getNotas();
    res.json(notas);
  });

  app.get("/api/notas/:id", async (req, res) => {
    const nota = await storage.getNota(parseInt(req.params.id));
    if (!nota) {
      return res.status(404).json({ message: "Nota não encontrada" });
    }
    res.json(nota);
  });

  app.get("/api/notas/aluno/:alunoId", async (req, res) => {
    const notas = await storage.getNotasByAluno(parseInt(req.params.alunoId));
    res.json(notas);
  });

  app.get("/api/notas/turma/:turmaId", async (req, res) => {
    const notas = await storage.getNotasByTurma(parseInt(req.params.turmaId));
    res.json(notas);
  });

  app.post("/api/notas", async (req, res) => {
    const result = insertNotaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const nota = await storage.createNota(result.data);
    res.status(201).json(nota);
  });

  app.put("/api/notas/:id", async (req, res) => {
    const result = insertNotaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: result.error });
    }
    const nota = await storage.updateNota(parseInt(req.params.id), result.data);
    if (!nota) {
      return res.status(404).json({ message: "Nota não encontrada" });
    }
    res.json(nota);
  });

  app.delete("/api/notas/:id", async (req, res) => {
    await storage.deleteNota(parseInt(req.params.id));
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
