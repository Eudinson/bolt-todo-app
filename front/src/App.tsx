import React, { useState } from 'react';
import { Container, Alert, Snackbar } from '@mui/material';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { useTodos } from './hooks/useTodos';
import Header from './components/Header';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import ErrorBoundary from './components/ErrorBoundary';
import { Todo, TodoFormData } from './types/Todo';

function App() {
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
  } = useTodos();

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Delete confirmation state
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: TodoFormData) => {
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, formData);
        setSuccessMessage('Todo updated successfully!');
      } else {
        await createTodo(formData);
        setSuccessMessage('Todo created successfully!');
      }
    } catch (error) {
      throw error; // Let the form handle the error
    }
  };

  const handleDeleteTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setDeletingTodo(todo);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTodo) return;

    setIsDeleting(true);
    try {
      await deleteTodo(deletingTodo.id);
      setSuccessMessage('Todo deleted successfully!');
      setDeletingTodo(null);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeletingTodo(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const handleCloseSuccess = () => {
    setSuccessMessage(null);
  };

  return (
    <ErrorBoundary>
      <CustomThemeProvider>
        <Header />
        
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TodoList
            todos={todos}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
            onToggleStatus={toggleTodoStatus}
            onAdd={handleAddTodo}
            loading={loading}
          />

          <TodoForm
            open={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            todo={editingTodo}
            title={editingTodo ? 'Edit Todo' : 'Create New Todo'}
          />

          <DeleteConfirmDialog
            open={!!deletingTodo}
            onClose={handleCloseDeleteDialog}
            onConfirm={handleConfirmDelete}
            todoTitle={deletingTodo?.title || ''}
            loading={isDeleting}
          />

          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={handleCloseSuccess}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseSuccess} 
              severity="success" 
              sx={{ width: '100%' }}
            >
              {successMessage}
            </Alert>
          </Snackbar>
        </Container>
      </CustomThemeProvider>
    </ErrorBoundary>
  );
}

export default App;