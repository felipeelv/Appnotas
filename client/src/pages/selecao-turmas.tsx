import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Turma } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function SelecaoTurmas() {
  const [, navigate] = useLocation();

  const { data: turmas, isLoading } = useQuery<Turma[]>({
    queryKey: ["/api/turmas"],
  });

  const handleTurmaClick = (turmaId: number) => {
    navigate(`/lancar-notas/${turmaId}`);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Selecione uma Turma</h1>
        <p className="text-muted-foreground">
          Escolha a turma para lançar as notas dos alunos
        </p>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Carregando turmas...</div>
      ) : turmas && turmas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmas.map((turma) => (
            <Card
              key={turma.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleTurmaClick(turma.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-xl">{turma.nome}</CardTitle>
                <GraduationCap className="w-8 h-8 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clique para lançar notas
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Nenhuma turma cadastrada ainda.
          </p>
          <p className="text-sm text-muted-foreground">
            Cadastre turmas primeiro em "Turmas" no menu lateral.
          </p>
        </div>
      )}
    </div>
  );
}
