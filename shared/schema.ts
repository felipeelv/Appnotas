import { sql } from "drizzle-orm";
import { pgTable, serial, text, integer, unique, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const turmas = pgTable("turmas", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
});

export const professores = pgTable("professores", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
});

export const disciplinas = pgTable("disciplinas", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
});

export const alunos = pgTable("alunos", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  turmaId: integer("turma_id").notNull().references(() => turmas.id),
});

export const professorDisciplinaTurma = pgTable("professor_disciplina_turma", {
  id: serial("id").primaryKey(),
  professorId: integer("professor_id").notNull().references(() => professores.id),
  disciplinaId: integer("disciplina_id").notNull().references(() => disciplinas.id),
  turmaId: integer("turma_id").notNull().references(() => turmas.id),
}, (table) => ({
  uniqueConstraint: unique().on(table.professorId, table.disciplinaId, table.turmaId),
}));

export const notas = pgTable("notas", {
  id: serial("id").primaryKey(),
  alunoId: integer("aluno_id").notNull().references(() => alunos.id),
  disciplinaId: integer("disciplina_id").notNull().references(() => disciplinas.id),
  valor: decimal("valor", { precision: 5, scale: 2 }).notNull(),
  periodo: text("periodo").notNull(),
});

export const insertTurmaSchema = createInsertSchema(turmas).omit({ id: true });
export const insertProfessorSchema = createInsertSchema(professores).omit({ id: true });
export const insertDisciplinaSchema = createInsertSchema(disciplinas).omit({ id: true });
export const insertAlunoSchema = createInsertSchema(alunos).omit({ id: true });
export const insertProfessorDisciplinaTurmaSchema = createInsertSchema(professorDisciplinaTurma).omit({ id: true });
export const insertNotaSchema = createInsertSchema(notas).omit({ id: true });

export type InsertTurma = z.infer<typeof insertTurmaSchema>;
export type InsertProfessor = z.infer<typeof insertProfessorSchema>;
export type InsertDisciplina = z.infer<typeof insertDisciplinaSchema>;
export type InsertAluno = z.infer<typeof insertAlunoSchema>;
export type InsertProfessorDisciplinaTurma = z.infer<typeof insertProfessorDisciplinaTurmaSchema>;
export type InsertNota = z.infer<typeof insertNotaSchema>;

export type Turma = typeof turmas.$inferSelect;
export type Professor = typeof professores.$inferSelect;
export type Disciplina = typeof disciplinas.$inferSelect;
export type Aluno = typeof alunos.$inferSelect;
export type ProfessorDisciplinaTurma = typeof professorDisciplinaTurma.$inferSelect;
export type Nota = typeof notas.$inferSelect;
