import { db } from "./db";
import { 
  turmas, professores, disciplinas, alunos, professorDisciplinaTurma,
  type Turma, type Professor, type Disciplina, type Aluno, type ProfessorDisciplinaTurma,
  type InsertTurma, type InsertProfessor, type InsertDisciplina, type InsertAluno, type InsertProfessorDisciplinaTurma
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTurmas(): Promise<Turma[]>;
  getTurma(id: number): Promise<Turma | undefined>;
  createTurma(data: InsertTurma): Promise<Turma>;
  updateTurma(id: number, data: InsertTurma): Promise<Turma | undefined>;
  deleteTurma(id: number): Promise<void>;

  getProfessores(): Promise<Professor[]>;
  getProfessor(id: number): Promise<Professor | undefined>;
  createProfessor(data: InsertProfessor): Promise<Professor>;
  updateProfessor(id: number, data: InsertProfessor): Promise<Professor | undefined>;
  deleteProfessor(id: number): Promise<void>;

  getDisciplinas(): Promise<Disciplina[]>;
  getDisciplina(id: number): Promise<Disciplina | undefined>;
  createDisciplina(data: InsertDisciplina): Promise<Disciplina>;
  updateDisciplina(id: number, data: InsertDisciplina): Promise<Disciplina | undefined>;
  deleteDisciplina(id: number): Promise<void>;

  getAlunos(): Promise<Aluno[]>;
  getAluno(id: number): Promise<Aluno | undefined>;
  createAluno(data: InsertAluno): Promise<Aluno>;
  updateAluno(id: number, data: InsertAluno): Promise<Aluno | undefined>;
  deleteAluno(id: number): Promise<void>;

  getAssociacoes(): Promise<ProfessorDisciplinaTurma[]>;
  getAssociacao(id: number): Promise<ProfessorDisciplinaTurma | undefined>;
  createAssociacao(data: InsertProfessorDisciplinaTurma): Promise<ProfessorDisciplinaTurma>;
  deleteAssociacao(id: number): Promise<void>;
}

export class DbStorage implements IStorage {
  async getTurmas(): Promise<Turma[]> {
    return await db.select().from(turmas);
  }

  async getTurma(id: number): Promise<Turma | undefined> {
    const result = await db.select().from(turmas).where(eq(turmas.id, id));
    return result[0];
  }

  async createTurma(data: InsertTurma): Promise<Turma> {
    const result = await db.insert(turmas).values(data).returning();
    return result[0];
  }

  async updateTurma(id: number, data: InsertTurma): Promise<Turma | undefined> {
    const result = await db.update(turmas).set(data).where(eq(turmas.id, id)).returning();
    return result[0];
  }

  async deleteTurma(id: number): Promise<void> {
    await db.delete(turmas).where(eq(turmas.id, id));
  }

  async getProfessores(): Promise<Professor[]> {
    return await db.select().from(professores);
  }

  async getProfessor(id: number): Promise<Professor | undefined> {
    const result = await db.select().from(professores).where(eq(professores.id, id));
    return result[0];
  }

  async createProfessor(data: InsertProfessor): Promise<Professor> {
    const result = await db.insert(professores).values(data).returning();
    return result[0];
  }

  async updateProfessor(id: number, data: InsertProfessor): Promise<Professor | undefined> {
    const result = await db.update(professores).set(data).where(eq(professores.id, id)).returning();
    return result[0];
  }

  async deleteProfessor(id: number): Promise<void> {
    await db.delete(professores).where(eq(professores.id, id));
  }

  async getDisciplinas(): Promise<Disciplina[]> {
    return await db.select().from(disciplinas);
  }

  async getDisciplina(id: number): Promise<Disciplina | undefined> {
    const result = await db.select().from(disciplinas).where(eq(disciplinas.id, id));
    return result[0];
  }

  async createDisciplina(data: InsertDisciplina): Promise<Disciplina> {
    const result = await db.insert(disciplinas).values(data).returning();
    return result[0];
  }

  async updateDisciplina(id: number, data: InsertDisciplina): Promise<Disciplina | undefined> {
    const result = await db.update(disciplinas).set(data).where(eq(disciplinas.id, id)).returning();
    return result[0];
  }

  async deleteDisciplina(id: number): Promise<void> {
    await db.delete(disciplinas).where(eq(disciplinas.id, id));
  }

  async getAlunos(): Promise<Aluno[]> {
    return await db.select().from(alunos);
  }

  async getAluno(id: number): Promise<Aluno | undefined> {
    const result = await db.select().from(alunos).where(eq(alunos.id, id));
    return result[0];
  }

  async createAluno(data: InsertAluno): Promise<Aluno> {
    const result = await db.insert(alunos).values(data).returning();
    return result[0];
  }

  async updateAluno(id: number, data: InsertAluno): Promise<Aluno | undefined> {
    const result = await db.update(alunos).set(data).where(eq(alunos.id, id)).returning();
    return result[0];
  }

  async deleteAluno(id: number): Promise<void> {
    await db.delete(alunos).where(eq(alunos.id, id));
  }

  async getAssociacoes(): Promise<ProfessorDisciplinaTurma[]> {
    return await db.select().from(professorDisciplinaTurma);
  }

  async getAssociacao(id: number): Promise<ProfessorDisciplinaTurma | undefined> {
    const result = await db.select().from(professorDisciplinaTurma).where(eq(professorDisciplinaTurma.id, id));
    return result[0];
  }

  async createAssociacao(data: InsertProfessorDisciplinaTurma): Promise<ProfessorDisciplinaTurma> {
    const result = await db.insert(professorDisciplinaTurma).values(data).returning();
    return result[0];
  }

  async deleteAssociacao(id: number): Promise<void> {
    await db.delete(professorDisciplinaTurma).where(eq(professorDisciplinaTurma.id, id));
  }
}

export const storage = new DbStorage();
