import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Professor, InsertProfessor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProfessorSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Professores() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: professores, isLoading } = useQuery<Professor[]>({
    queryKey: ["/api/professores"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProfessor) => {
      return await apiRequest("/api/professores", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/professores"] });
      setIsCreateOpen(false);
      toast({ title: "Professor criado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar professor", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProfessor }) => {
      return await apiRequest(`/api/professores/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/professores"] });
      setEditingProfessor(null);
      toast({ title: "Professor atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar professor", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/professores/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/professores"] });
      setDeletingId(null);
      toast({ title: "Professor excluído com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir professor", variant: "destructive" });
    },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Professores</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-professor">
              <Plus className="w-4 h-4 mr-2" />
              Novo Professor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Professor</DialogTitle>
            </DialogHeader>
            <ProfessorForm 
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
          {professores?.map((professor) => (
            <Card key={professor.id} data-testid={`card-professor-${professor.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-lg">{professor.nome}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => setEditingProfessor(professor)}
                    data-testid={`button-edit-professor-${professor.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => setDeletingId(professor.id)}
                    data-testid={`button-delete-professor-${professor.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingProfessor} onOpenChange={(open) => !open && setEditingProfessor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Professor</DialogTitle>
          </DialogHeader>
          {editingProfessor && (
            <ProfessorForm 
              defaultValues={editingProfessor}
              onSubmit={(data) => updateMutation.mutate({ id: editingProfessor.id, data })}
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
              Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.
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

function ProfessorForm({ 
  defaultValues, 
  onSubmit, 
  isPending 
}: { 
  defaultValues?: Professor; 
  onSubmit: (data: InsertProfessor) => void;
  isPending: boolean;
}) {
  const form = useForm<InsertProfessor>({
    resolver: zodResolver(insertProfessorSchema),
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
              <FormLabel>Nome do Professor</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-nome-professor" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} data-testid="button-submit-professor">
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
