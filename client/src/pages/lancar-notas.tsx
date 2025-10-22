import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Aluno, Disciplina, Nota, InsertNota } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil } from "lucide-react";

export default function LancarNotas() {
  const [, params] = useRoute("/lancar-notas/:id");
  const [, navigate] = useLocation();
  const turmaId = params?.id ? parseInt(params.id) : null;
  const [selectedPeriodo, setSelectedPeriodo] = useState("1º Bimestre");
  const [editingNota, setEditingNota] = useState<{ alunoId: number; disciplinaId: number; nota?: Nota } | null>(null);
  const { toast } = useToast();

  const { data: turma } = useQuery({
    queryKey: [`/api/turmas/${turmaId}`],
    enabled: !!turmaId,
  });

  const { data: alunos, isLoading: loadingAlunos } = useQuery<Aluno[]>({
    queryKey: ["/api/alunos"],
  });

  const { data: disciplinas, isLoading: loadingDisciplinas } = useQuery<Disciplina[]>({
    queryKey: ["/api/disciplinas"],
  });

  const { data: notas, isLoading: loadingNotas } = useQuery<Nota[]>({
    queryKey: [`/api/notas/turma/${turmaId}`],
    enabled: !!turmaId,
  });

  const alunosDaTurma = useMemo(() => {
    if (!alunos || !turmaId) return [];
    return alunos.filter(aluno => aluno.turmaId === turmaId);
  }, [alunos, turmaId]);

  const createNotaMutation = useMutation({
    mutationFn: async (data: InsertNota) => {
      return await apiRequest("POST", "/api/notas", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notas/turma/${turmaId}`] });
      setEditingNota(null);
      toast({ title: "Nota lançada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao lançar nota", variant: "destructive" });
    },
  });

  const updateNotaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertNota }) => {
      return await apiRequest("PUT", `/api/notas/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notas/turma/${turmaId}`] });
      setEditingNota(null);
      toast({ title: "Nota atualizada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar nota", variant: "destructive" });
    },
  });

  const getNota = (alunoId: number, disciplinaId: number, periodo: string) => {
    return notas?.find(
      n => n.alunoId === alunoId && n.disciplinaId === disciplinaId && n.periodo === periodo
    );
  };

  const handleEditNota = (alunoId: number, disciplinaId: number) => {
    const nota = getNota(alunoId, disciplinaId, selectedPeriodo);
    setEditingNota({ alunoId, disciplinaId, nota });
  };

  if (!turmaId) {
    return (
      <div className="p-8">
        <p className="text-destructive">Turma não encontrada</p>
      </div>
    );
  }

  const isLoading = loadingAlunos || loadingDisciplinas || loadingNotas;

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Seleção de Turmas
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Lançamento de Notas</h1>
            <p className="text-muted-foreground mt-1">
              Turma: <span className="font-medium">{turma?.nome || "Carregando..."}</span>
            </p>
          </div>
          <div className="w-48">
            <Label htmlFor="periodo">Período</Label>
            <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
              <SelectTrigger id="periodo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1º Bimestre">1º Bimestre</SelectItem>
                <SelectItem value="2º Bimestre">2º Bimestre</SelectItem>
                <SelectItem value="3º Bimestre">3º Bimestre</SelectItem>
                <SelectItem value="4º Bimestre">4º Bimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Carregando...</div>
      ) : alunosDaTurma.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhum aluno cadastrado nesta turma ainda.
            </p>
          </CardContent>
        </Card>
      ) : disciplinas && disciplinas.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhuma disciplina cadastrada ainda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alunosDaTurma.map((aluno) => (
            <Card key={aluno.id}>
              <CardHeader>
                <CardTitle className="text-lg">{aluno.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {disciplinas?.map((disciplina) => {
                    const nota = getNota(aluno.id, disciplina.id, selectedPeriodo);
                    return (
                      <div
                        key={disciplina.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleEditNota(aluno.id, disciplina.id)}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{disciplina.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {nota ? `Nota: ${nota.valor}` : "Sem nota"}
                          </p>
                        </div>
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingNota} onOpenChange={(open) => !open && setEditingNota(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNota?.nota ? "Editar Nota" : "Lançar Nota"}
            </DialogTitle>
          </DialogHeader>
          {editingNota && (
            <NotaForm
              aluno={alunosDaTurma.find(a => a.id === editingNota.alunoId)!}
              disciplina={disciplinas?.find(d => d.id === editingNota.disciplinaId)!}
              periodo={selectedPeriodo}
              defaultValue={editingNota.nota?.valor}
              onSubmit={(valor) => {
                const data: InsertNota = {
                  alunoId: editingNota.alunoId,
                  disciplinaId: editingNota.disciplinaId,
                  valor,
                  periodo: selectedPeriodo,
                };
                if (editingNota.nota) {
                  updateNotaMutation.mutate({ id: editingNota.nota.id, data });
                } else {
                  createNotaMutation.mutate(data);
                }
              }}
              isPending={createNotaMutation.isPending || updateNotaMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NotaForm({
  aluno,
  disciplina,
  periodo,
  defaultValue,
  onSubmit,
  isPending,
}: {
  aluno: Aluno;
  disciplina: Disciplina;
  periodo: string;
  defaultValue?: string;
  onSubmit: (valor: string) => void;
  isPending: boolean;
}) {
  const [valor, setValor] = useState(defaultValue || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valor || parseFloat(valor) < 0 || parseFloat(valor) > 10) {
      return;
    }
    onSubmit(valor);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Aluno</Label>
        <p className="text-sm font-medium mt-1">{aluno.nome}</p>
      </div>
      <div>
        <Label>Disciplina</Label>
        <p className="text-sm font-medium mt-1">{disciplina.nome}</p>
      </div>
      <div>
        <Label>Período</Label>
        <p className="text-sm font-medium mt-1">{periodo}</p>
      </div>
      <div>
        <Label htmlFor="valor">Nota (0 a 10)</Label>
        <Input
          id="valor"
          type="number"
          step="0.01"
          min="0"
          max="10"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ex: 8.5"
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar Nota"}
      </Button>
    </form>
  );
}
