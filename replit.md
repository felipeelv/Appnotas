# Sistema de Avaliação Escolar

## Overview

A Brazilian Portuguese school evaluation management system built with a modern full-stack architecture. The application provides CRUD operations for managing classes (turmas), teachers (professores), subjects (disciplinas), students (alunos), and their associations (professor-disciplina-turma relationships). This is a utility-focused educational management system designed for information-dense displays and efficient data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Path aliases configured (`@/`, `@shared/`, `@assets/`) for clean imports

**State Management & Data Fetching:**
- TanStack Query (React Query) v5 for server state management
- Custom query client with configured defaults (no refetch on window focus, infinite stale time)
- React Hook Form with Zod resolvers for form validation
- Optimistic updates and cache invalidation on mutations

**UI Component System:**
- Shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Material Design 3 principles for information-dense educational interfaces
- Custom CSS variables for theming (light/dark mode support)
- Hover and active state elevation patterns for better UX

**Design Tokens:**
- Professional blue primary color (220 85% 55%)
- Inter font family for UI, Roboto as fallback
- Consistent border radius: lg (9px), md (6px), sm (3px)
- Custom elevation system using opacity overlays

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM module system throughout
- Custom middleware for request logging and JSON response capture
- Error handling middleware for consistent error responses

**API Design:**
- RESTful API structure under `/api` prefix
- Resource-based endpoints (turmas, professores, disciplinas, alunos, associacoes)
- Standard CRUD operations (GET, POST, PUT, DELETE)
- Zod schema validation on all POST/PUT requests
- Consistent JSON response format with error handling

**Data Access Layer:**
- Storage abstraction interface (IStorage) for database operations
- DbStorage implementation using Drizzle ORM
- Separation of concerns between routes and storage logic

### Database Schema

**ORM & Database:**
- Drizzle ORM with PostgreSQL dialect
- Neon serverless PostgreSQL as the database provider
- WebSocket connection for serverless compatibility
- Schema-first approach with TypeScript inference

**Core Tables:**
1. **turmas** (Classes) - id, nome
2. **professores** (Teachers) - id, nome
3. **disciplinas** (Subjects) - id, nome
4. **alunos** (Students) - id, nome, turmaId (FK)
5. **professor_disciplina_turma** (Associations) - id, professorId (FK), disciplinaId (FK), turmaId (FK)
   - Unique constraint on (professorId, disciplinaId, turmaId) to prevent duplicate associations

**Schema Validation:**
- Drizzle-zod for automatic schema-to-Zod conversion
- Insert schemas exclude auto-generated IDs
- Type inference for both insert and select operations

### External Dependencies

**Database Service:**
- Neon Serverless PostgreSQL
- Connection via `@neondatabase/serverless` package
- WebSocket support using `ws` package for serverless environments
- Connection string from `DATABASE_URL` environment variable

**UI Component Libraries:**
- Radix UI primitives for accessible components (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, tooltip)
- Embla Carousel for carousel components
- CMDK for command palette functionality
- Lucide React for icon system

**Form & Validation:**
- React Hook Form for form state management
- Zod for schema validation
- @hookform/resolvers for Zod integration

**Styling & Utilities:**
- Tailwind CSS with PostCSS
- class-variance-authority for variant-based component styling
- clsx and tailwind-merge for className composition
- date-fns for date manipulation

**Development Tools:**
- Replit-specific plugins for development (vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner)
- TSX for running TypeScript server in development
- ESBuild for production server bundling
- Drizzle Kit for database migrations

**Build & Deployment:**
- Vite for client bundling with React plugin
- ESBuild for server bundling with ESM format
- Separate build outputs: `dist/public` for client, `dist` for server
- Production server runs on Node.js with compiled ESM modules