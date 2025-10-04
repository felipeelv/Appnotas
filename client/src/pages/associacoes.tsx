import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ProfessorDisciplinaTurma, InsertProfessorDisciplinaTurma, Professor, Disciplina, Turma } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProfessorDisciplinaTurmaSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Associacoes() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: associacoes, isLoading } = useQuery<ProfessorDisciplinaTurma[]>({
    queryKey: ["/api/associacoes"],
  });

  const { data: professores } = useQuery<Professor[]>({
    queryKey: ["/api/professores"],
  });

  const { data: disciplinas } = useQuery<Disciplina[]>({
    queryKey: ["/api/disciplinas"],
  });

  const { data: turmas } = useQuery<Turma[]>({
    queryKey: ["/api/turmas"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProfessorDisciplinaTurma) => {
      return await apiRequest("POST", "/api/associacoes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/associacoes"] });
      setIsCreateOpen(false);
      toast({ title: "Associação criada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar associação", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/associacoes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/associacoes"] });
      setDeletingId(null);
      toast({ title: "Associação excluída com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir associação", variant: "destructive" });
    },
  });

  const getNome = (id: number, lista?: { id: number; nome: string }[]) => {
    return lista?.find(item => item.id === id)?.nome || "N/A";
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Associações Professor-Disciplina-Turma</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-associacao">
              <Plus className="w-4 h-4 mr-2" />
              Nova Associação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Associação</DialogTitle>
            </DialogHeader>
            <AssociacaoForm 
              professores={professores || []}
              disciplinas={disciplinas || []}
              turmas={turmas || []}
              onSubmit={(data) => createMutation.mutate(data)}
              isPending={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {associacoes?.map((associacao) => (
            <Card key={associacao.id} data-testid={`card-associacao-${associacao.id}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    {getNome(associacao.professorId, professores)}
                  </CardTitle>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Disciplina:</span> {getNome(associacao.disciplinaId, disciplinas)}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Turma:</span> {getNome(associacao.turmaId, turmas)}
                    </p>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setDeletingId(associacao.id)}
                  data-testid={`button-delete-associacao-${associacao.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta associação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              data-testid="button-confirm-delete"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AssociacaoForm({ 
  professores,
  disciplinas,
  turmas,
  onSubmit, 
  isPending 
}: { 
  professores: Professor[];
  disciplinas: Disciplina[];
  turmas: Turma[];
  onSubmit: (data: InsertProfessorDisciplinaTurma) => void;
  isPending: boolean;
}) {
  const form = useForm<InsertProfessorDisciplinaTurma>({
    resolver: zodResolver(insertProfessorDisciplinaTurmaSchema),
    defaultValues: { professorId: 0, disciplinaId: 0, turmaId: 0 },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="professorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professor</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger data-testid="select-professor">
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {professores.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id.toString()}>
                      {professor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="disciplinaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger data-testid="select-disciplina">
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {disciplinas.map((disciplina) => (
                    <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                      {disciplina.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="turmaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turma</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger data-testid="select-turma">
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {turmas.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id.toString()}>
                      {turma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} data-testid="button-submit-associacao">
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
