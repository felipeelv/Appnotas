# Configuração do Banco de Dados

## Para usar no Replit (PostgreSQL)

1. **No Replit, vá até a aba "Tools"** no menu lateral
2. **Clique em "Database"** ou "PostgreSQL"
3. **Clique em "Create database"** ou equivalente
4. O Replit irá automaticamente:
   - Provisionar um banco de dados PostgreSQL
   - Configurar a variável de ambiente `DATABASE_URL`
   - Reiniciar o servidor

5. Após o banco estar provisionado, execute:
   ```bash
   npm run db:push
   ```
   Isso irá criar todas as tabelas necessárias.

6. Execute a aplicação:
   ```bash
   npm run dev
   ```

## Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas:

- **turmas**: Cadastro de turmas/classes
- **professores**: Cadastro de professores
- **disciplinas**: Cadastro de disciplinas/matérias
- **alunos**: Cadastro de alunos (vinculados a turmas)
- **professor_disciplina_turma**: Associações entre professores, disciplinas e turmas
- **notas**: Lançamento de notas dos alunos por disciplina e período

## Ordem de Cadastro Recomendada

1. Cadastre as **Turmas** (ex: 1º Ano A, 2º Ano B)
2. Cadastre as **Disciplinas** (ex: Matemática, Português)
3. Cadastre os **Professores**
4. Cadastre os **Alunos** e vincule-os às turmas
5. (Opcional) Crie associações Professor-Disciplina-Turma
6. Use a página inicial para selecionar uma turma e lançar notas

## Acesso à Aplicação

- **Página Inicial**: Lista de turmas para seleção
- **Menu Lateral**: Acesso às páginas de cadastro (Turmas, Alunos, Disciplinas, etc.)
- **Lançamento de Notas**: Clique em uma turma na página inicial
