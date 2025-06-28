import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Chip,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
  Checkbox,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Todo, Priority, Status } from '../types/Todo';
import { format, isValid } from 'date-fns';

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onAdd: () => void;
  loading: boolean;
}

type SortField = 'title' | 'dueDate' | 'priority' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onEdit,
  onDelete,
  onToggleStatus,
  onAdd,
  loading,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  // Priority sorting order
  const priorityOrder: Record<Priority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  // Status sorting order
  const statusOrder: Record<Status, number> = {
    'in-progress': 3,
    pending: 2,
    completed: 1,
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        todo =>
          todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(todo => todo.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(todo => todo.priority === priorityFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'dueDate':
          aValue = a.dueDate?.getTime() || 0;
          bValue = b.dueDate?.getTime() || 0;
          break;
        case 'priority':
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [todos, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

  const getPriorityColor = (priority: Priority): 'error' | 'warning' | 'info' => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
    }
  };

  const getStatusColor = (status: Status): 'success' | 'info' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'default';
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date || !isValid(date)) return '-';
    return format(date, 'MMM dd, yyyy');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading todos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header and Controls */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h2">
            My Todos
          </Typography>
          <IconButton
            color="primary"
            onClick={onAdd}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Empty State */}
      {filteredAndSortedTodos.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {todos.length === 0 ? 'No todos yet' : 'No todos match your filters'}
          </Typography>
          <Typography color="text.secondary">
            {todos.length === 0 
              ? 'Create your first todo to get started!'
              : 'Try adjusting your search or filters.'}
          </Typography>
        </Paper>
      )}

      {/* Mobile Card View */}
      {isMobile && filteredAndSortedTodos.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredAndSortedTodos.map((todo) => (
            <Card key={todo.id} sx={{ position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Checkbox
                    checked={todo.status === 'completed'}
                    onChange={() => onToggleStatus(todo.id)}
                    sx={{ mt: -1 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                        mb: 1 
                      }}
                    >
                      {todo.title}
                    </Typography>
                    {todo.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {todo.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      <Chip
                        label={todo.priority}
                        color={getPriorityColor(todo.priority)}
                        size="small"
                      />
                      <Chip
                        label={todo.status}
                        color={getStatusColor(todo.status)}
                        size="small"
                      />
                      {todo.dueDate && (
                        <Chip
                          label={formatDate(todo.dueDate)}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <Tooltip title="Edit todo">
                  <IconButton onClick={() => onEdit(todo)} size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete todo">
                  <IconButton onClick={() => onDelete(todo.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Desktop Table View */}
      {!isMobile && filteredAndSortedTodos.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      filteredAndSortedTodos.some(todo => todo.status === 'completed') &&
                      filteredAndSortedTodos.some(todo => todo.status !== 'completed')
                    }
                    checked={
                      filteredAndSortedTodos.length > 0 &&
                      filteredAndSortedTodos.every(todo => todo.status === 'completed')
                    }
                    onChange={(e) => {
                      const newStatus = e.target.checked ? 'completed' : 'pending';
                      filteredAndSortedTodos.forEach(todo => {
                        if ((newStatus === 'completed' && todo.status !== 'completed') ||
                            (newStatus === 'pending' && todo.status === 'completed')) {
                          onToggleStatus(todo.id);
                        }
                      });
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'title'}
                    direction={sortField === 'title' ? sortDirection : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'dueDate'}
                    direction={sortField === 'dueDate' ? sortDirection : 'asc'}
                    onClick={() => handleSort('dueDate')}
                  >
                    Due Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'priority'}
                    direction={sortField === 'priority' ? sortDirection : 'asc'}
                    onClick={() => handleSort('priority')}
                  >
                    Priority
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'status'}
                    direction={sortField === 'status' ? sortDirection : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedTodos.map((todo) => (
                <TableRow key={todo.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={todo.status === 'completed'}
                      onChange={() => onToggleStatus(todo.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                          fontWeight: 500,
                        }}
                      >
                        {todo.title}
                      </Typography>
                      {todo.description && (
                        <Typography variant="body2" color="text.secondary">
                          {todo.description}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {formatDate(todo.dueDate)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={todo.priority}
                      color={getPriorityColor(todo.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={todo.status}
                      color={getStatusColor(todo.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit todo">
                        <IconButton onClick={() => onEdit(todo)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete todo">
                        <IconButton onClick={() => onDelete(todo.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TodoList;