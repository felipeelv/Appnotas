import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Disciplina, InsertDisciplina } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDisciplinaSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Disciplinas() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: disciplinas, isLoading } = useQuery<Disciplina[]>({
    queryKey: ["/api/disciplinas"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertDisciplina) => {
      return await apiRequest("POST", "/api/disciplinas", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disciplinas"] });
      setIsCreateOpen(false);
      toast({ title: "Disciplina criada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar disciplina", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertDisciplina }) => {
      return await apiRequest("PUT", `/api/disciplinas/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disciplinas"] });
      setEditingDisciplina(null);
      toast({ title: "Disciplina atualizada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar disciplina", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/disciplinas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disciplinas"] });
      setDeletingId(null);
      toast({ title: "Disciplina excluída com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir disciplina", variant: "destructive" });
    },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Disciplinas</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-disciplina">
              <Plus className="w-4 h-4 mr-2" />
              Nova Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Disciplina</DialogTitle>
            </DialogHeader>
            <DisciplinaForm 
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
          {disciplinas?.map((disciplina) => (
            <Card key={disciplina.id} data-testid={`card-disciplina-${disciplina.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-lg">{disciplina.nome}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => setEditingDisciplina(disciplina)}
                    data-testid={`button-edit-disciplina-${disciplina.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => setDeletingId(disciplina.id)}
                    data-testid={`button-delete-disciplina-${disciplina.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingDisciplina} onOpenChange={(open) => !open && setEditingDisciplina(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Disciplina</DialogTitle>
          </DialogHeader>
          {editingDisciplina && (
            <DisciplinaForm 
              defaultValues={editingDisciplina}
              onSubmit={(data) => updateMutation.mutate({ id: editingDisciplina.id, data })}
              isPending={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta disciplina? Esta ação não pode ser desfeita.
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

function DisciplinaForm({ 
  defaultValues, 
  onSubmit, 
  isPending 
}: { 
  defaultValues?: Disciplina; 
  onSubmit: (data: InsertDisciplina) => void;
  isPending: boolean;
}) {
  const form = useForm<InsertDisciplina>({
    resolver: zodResolver(insertDisciplinaSchema),
    defaultValues: defaultValues || { nome: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Disciplina</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-nome-disciplina" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} data-testid="button-submit-disciplina">
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
