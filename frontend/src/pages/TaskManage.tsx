import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import {
  getAllTasksService,
  createTaskService,
  updateTaskService,
  getTaskByIdService,
} from "@/services/TaskService";
import type { Task, TaskFormData } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/forms/InputForm";
import { SelectForm } from "@/components/forms/SelectForm";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const TaskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["Pending", "Completed"]),
});

type TaskFormValues = z.infer<typeof TaskFormSchema>;

export const TaskManage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "Pending",
    },
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getAllTasksService();
      if (response?.success && response.data) {
        const userTasks = response.data.filter(
          (task) =>
            (typeof task.userId === "string" && task.userId === user?.id) ||
            (typeof task.userId === "object" && task.userId._id === user?.id)
        );
        setTasks(userTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskById = async (id: string) => {
    try {
      setLoading(true);
      const response = await getTaskByIdService(id);
      if (response?.success && response.data) {
        form.reset({
          title: response.data.title,
          description: response.data.description,
          status: response.data.status,
        });
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingTaskId(null);
    form.reset({
      title: "",
      description: "",
      status: "Pending",
    });
    setDialogOpen(true);
  };

  const openEditDialog = async (id: string) => {
    setEditingTaskId(id);
    await fetchTaskById(id);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTaskId(null);
    form.reset({
      title: "",
      description: "",
      status: "Pending",
    });
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setSubmitting(true);
      const taskData: TaskFormData = {
        ...data,
        createdAt: editingTaskId ? undefined : new Date(),
      };

      let response;
      if (editingTaskId) {
        response = await updateTaskService(editingTaskId, taskData);
      } else {
        response = await createTaskService(taskData);
      }

      if (response?.success) {
        form.reset();
        closeDialog();
        await fetchTasks();
      }
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl md:text-2xl">My Tasks</CardTitle>
          <Button onClick={openCreateDialog} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks found. Create your first task!
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 md:p-4 rounded-lg border ${
                    task.isDeleted ? "opacity-60 bg-muted/50" : "bg-card"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-base md:text-lg ${
                        task.isDeleted
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p
                      className={`text-sm text-muted-foreground mt-1 ${
                        task.isDeleted ? "line-through" : ""
                      }`}
                    >
                      {task.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {task.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(task._id)}
                    disabled={task.isDeleted}
                    className="shrink-0"
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTaskId ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTaskId
                ? "Update the task details below."
                : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputForm
                type="text"
                label="Title"
                placeholder="Enter task title"
                name="title"
                control={form.control}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="text-start">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter task description"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SelectForm
                label="Status"
                placeholder="Select status"
                name="status"
                control={form.control}
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "Completed", label: "Completed" },
                ]}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editingTaskId
                    ? "Update Task"
                    : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
