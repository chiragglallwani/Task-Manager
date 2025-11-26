import { api } from "@/api/api";
import type { APIResponse, Task, TaskFormData } from "@/types/types";
import { AxiosError } from "axios";

export const getAllTasksService = async () => {
  try {
    const response = await api.get<APIResponse<Task[]>>("/tasks");
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      error: response.data.error,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
  }
};

export const getTaskByIdService = async (id: string) => {
  try {
    const response = await api.get<APIResponse<Task>>(`/tasks/${id}`);
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      error: response.data.error,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
  }
};

export const createTaskService = async (taskData: TaskFormData) => {
  try {
    const response = await api.post<APIResponse<Task>>("/tasks", taskData);
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      error: response.data.error,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
  }
};

export const updateTaskService = async (
  id: string,
  taskData: Partial<TaskFormData>
) => {
  try {
    const response = await api.put<APIResponse<Task>>(`/tasks/${id}`, taskData);
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      error: response.data.error,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
  }
};

export const deleteTaskService = async (id: string) => {
  try {
    const response = await api.delete<APIResponse<void>>(`/tasks/${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
      error: response.data.error,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
  }
};
