import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoData, UpdateTodoData, Status } from '../types/Todo';
import { todoService } from '../services/todoService';

/**
 * Custom hook for managing todos state and operations
 */
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  /**
   * Load all todos from the service
   */
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const todosData = await todoService.getAllTodos();
      setTodos(todosData);
    } catch (err) {
      setError('Failed to load todos');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new todo
   */
  const createTodo = useCallback(async (todoData: CreateTodoData): Promise<Todo> => {
    try {
      setError(null);
      const newTodo = await todoService.createTodo(todoData);
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError('Failed to create todo');
      throw err;
    }
  }, []);

  /**
   * Update an existing todo
   */
  const updateTodo = useCallback(async (id: string, updates: UpdateTodoData): Promise<Todo> => {
    try {
      setError(null);
      const updatedTodo = await todoService.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      return updatedTodo;
    } catch (err) {
      setError('Failed to update todo');
      throw err;
    }
  }, []);

  /**
   * Delete a todo
   */
  const deleteTodo = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      throw err;
    }
  }, []);

  /**
   * Toggle todo status between completed and pending
   */
  const toggleTodoStatus = useCallback(async (id: string): Promise<void> => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newStatus: Status = todo.status === 'completed' ? 'pending' : 'completed';
    await updateTodo(id, { status: newStatus });
  }, [todos, updateTodo]);

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
    refetch: loadTodos
  };
};