import { db } from "./db";
import { turmas, professores, disciplinas, alunos } from "@shared/schema";

async function seed() {
  console.log("Iniciando seed do banco de dados...");

  await db.delete(alunos);
  await db.delete(turmas);
  await db.delete(professores);
  await db.delete(disciplinas);

  const turmasData = await db.insert(turmas).values([
    { nome: "1ª série A" },
    { nome: "2ª série A" },
    { nome: "3ª série A" },
  ]).returning();

  const professoresData = await db.insert(professores).values([
    { nome: "Maria Silva" },
    { nome: "João Santos" },
    { nome: "Ana Costa" },
  ]).returning();

  const disciplinasData = await db.insert(disciplinas).values([
    { nome: "Matemática" },
    { nome: "Português" },
    { nome: "Inglês" },
  ]).returning();

  const alunosPorTurma = [
    [
      { nome: "Lucas Oliveira", turmaId: turmasData[0].id },
      { nome: "Mariana Santos", turmaId: turmasData[0].id },
      { nome: "Pedro Henrique", turmaId: turmasData[0].id },
      { nome: "Julia Costa", turmaId: turmasData[0].id },
      { nome: "Gabriel Alves", turmaId: turmasData[0].id },
    ],
    [
      { nome: "Sofia Lima", turmaId: turmasData[1].id },
      { nome: "Miguel Ferreira", turmaId: turmasData[1].id },
      { nome: "Isabella Rocha", turmaId: turmasData[1].id },
      { nome: "Davi Pereira", turmaId: turmasData[1].id },
      { nome: "Valentina Souza", turmaId: turmasData[1].id },
    ],
    [
      { nome: "Heitor Martins", turmaId: turmasData[2].id },
      { nome: "Alice Barbosa", turmaId: turmasData[2].id },
      { nome: "Arthur Ribeiro", turmaId: turmasData[2].id },
      { nome: "Laura Cardoso", turmaId: turmasData[2].id },
      { nome: "Enzo Araújo", turmaId: turmasData[2].id },
    ],
  ];

  for (const alunosData of alunosPorTurma) {
    await db.insert(alunos).values(alunosData);
  }

  console.log("Seed concluído com sucesso!");
  console.log(`- ${turmasData.length} turmas criadas`);
  console.log(`- ${professoresData.length} professores criados`);
  console.log(`- ${disciplinasData.length} disciplinas criadas`);
  console.log(`- ${alunosPorTurma.flat().length} alunos criados`);
}

seed()
  .then(() => {
    console.log("Processo de seed finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erro durante o seed:", error);
    process.exit(1);
  });
