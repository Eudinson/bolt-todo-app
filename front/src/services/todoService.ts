import { Todo, CreateTodoData, UpdateTodoData } from '../types/Todo';

/**
 * Service class for managing todo data operations
 * Uses localStorage for data persistence
 */
class TodoService {
  private readonly STORAGE_KEY = 'todos';

  /**
   * Get all todos from localStorage
   */
  async getAllTodos(): Promise<Todo[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const todos = JSON.parse(stored) as Todo[];
      // Convert date strings back to Date objects
      return todos.map(todo => ({
        ...todo,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading todos from storage:', error);
      return [];
    }
  }

  /**
   * Save todos to localStorage
   */
  private async saveTodos(todos: Todo[]): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to storage:', error);
      throw new Error('Failed to save todos');
    }
  }

  /**
   * Create a new todo
   */
  async createTodo(todoData: CreateTodoData): Promise<Todo> {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      ...todoData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const todos = await this.getAllTodos();
    todos.push(newTodo);
    await this.saveTodos(todos);
    
    return newTodo;
  }

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, updates: UpdateTodoData): Promise<Todo> {
    const todos = await this.getAllTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    const updatedTodo: Todo = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date()
    };

    todos[todoIndex] = updatedTodo;
    await this.saveTodos(todos);
    
    return updatedTodo;
  }

  /**
   * Delete a todo
   */
  async deleteTodo(id: string): Promise<void> {
    const todos = await this.getAllTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    
    if (filteredTodos.length === todos.length) {
      throw new Error('Todo not found');
    }

    await this.saveTodos(filteredTodos);
  }
}

export const todoService = new TodoService();