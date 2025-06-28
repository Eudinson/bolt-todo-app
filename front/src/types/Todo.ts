/**
 * Represents the priority level of a todo item
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Represents the status of a todo item
 */
export type Status = 'pending' | 'in-progress' | 'completed';

/**
 * Interface for a Todo item
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate: Date | null;
  priority: Priority;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for creating a new todo (without generated fields)
 */
export interface CreateTodoData {
  title: string;
  description?: string;
  dueDate: Date | null;
  priority: Priority;
}

/**
 * Interface for updating an existing todo
 */
export interface UpdateTodoData extends Partial<CreateTodoData> {
  status?: Status;
}

/**
 * Interface for form data when creating/editing todos
 */
export interface TodoFormData {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: Priority;
}