import React, { useState, useEffect, useCallback } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Toolbar, Typography, Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Checkbox, CircularProgress, Drawer, Divider, Select, MenuItem, FormControl, InputLabel, ListItemIcon, Snackbar, Paper } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Work as WorkIcon, Person as PersonIcon, ShoppingCart as ShoppingIcon, Favorite as HealthIcon, AttachMoney as FinanceIcon, Category as CategoryIcon } from '@mui/icons-material';

interface Task {
  id: bigint;
  description: string;
  completed: boolean;
  completionDate: bigint | null;
  category: string;
}

interface Category {
  id: bigint;
  name: string;
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'work': return <WorkIcon />;
    case 'personal': return <PersonIcon />;
    case 'shopping': return <ShoppingIcon />;
    case 'health': return <HealthIcon />;
    case 'finance': return <FinanceIcon />;
    default: return <CategoryIcon />;
  }
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [taskCategory, setTaskCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (err) {
        if (i === maxRetries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await retryOperation(() => backend.getTasks());
      if ('ok' in result) {
        setTasks(result.ok);
      } else {
        showError(`Error fetching tasks: ${result.err}`);
      }
    } catch (error) {
      showError(`Failed to fetch tasks: ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const result = await retryOperation(() => backend.getCategories());
      if ('ok' in result) {
        setCategories(result.ok);
        if (result.ok.length > 0 && !taskCategory) {
          setTaskCategory(result.ok[0].name);
        }
      } else {
        showError(`Error fetching categories: ${result.err}`);
      }
    } catch (error) {
      showError(`Failed to fetch categories: ${error}`);
    }
  }, [taskCategory]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);

  const addTask = async () => {
    if (newTask.trim() === '') return;
    setLoading(true);
    try {
      const result = await retryOperation(() => backend.addTask(newTask, taskCategory));
      if ('ok' in result) {
        setNewTask('');
        await fetchTasks();
      } else {
        showError(`Error adding task: ${result.err}`);
      }
    } catch (error) {
      showError(`Failed to add task: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (newCategory.trim() === '') return;
    try {
      const result = await retryOperation(() => backend.addCategory(newCategory));
      if ('ok' in result) {
        setNewCategory('');
        await fetchCategories();
      } else {
        showError(`Error adding category: ${result.err}`);
      }
    } catch (error) {
      showError(`Failed to add category: ${error}`);
    }
  };

  const toggleTask = async (id: bigint) => {
    setLoading(true);
    try {
      const result = await retryOperation(() => backend.completeTask(id));
      if ('ok' in result) {
        await fetchTasks();
      } else {
        showError(`Error toggling task: ${result.err}`);
      }
    } catch (error) {
      showError(`Failed to toggle task: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: bigint) => {
    setLoading(true);
    try {
      const result = await retryOperation(() => backend.deleteTask(id));
      if ('ok' in result) {
        await fetchTasks();
      } else {
        showError(`Error deleting task: ${result.err}`);
      }
    } catch (error) {
      showError(`Failed to delete task: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = selectedCategory === 'All' ? tasks : tasks.filter(task => task.category === selectedCategory);

  return (
    <div className="flex min-h-screen bg-white">
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <div className="p-4">
          <Typography variant="h6" className="mb-2 text-black">Categories</Typography>
          <List>
            <ListItem button onClick={() => setSelectedCategory('All')}>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="All" />
            </ListItem>
            {categories.map((category) => (
              <ListItem button key={Number(category.id)} onClick={() => setSelectedCategory(category.name)}>
                <ListItemIcon>
                  {getCategoryIcon(category.name)}
                </ListItemIcon>
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </List>
          <Divider className="my-4" />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mb-2"
          />
          <Button
            fullWidth
            variant="contained"
            onClick={addCategory}
          >
            Add Category
          </Button>
        </div>
      </Drawer>
      <div className="flex-grow">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className="flex-grow text-black">
              Task List App
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" className="mt-8">
          <Paper elevation={3} className="p-6 mb-6">
            <Typography variant="h6" className="mb-4 text-black">Add New Task</Typography>
            <div className="flex items-center space-x-4">
              <TextField
                variant="outlined"
                placeholder="Enter task description"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-grow"
                multiline
                rows={2}
              />
              <FormControl variant="outlined" className="min-w-[150px]">
                <InputLabel>Category</InputLabel>
                <Select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as string)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={Number(category.id)} value={category.name}>
                      <ListItemIcon>
                        {getCategoryIcon(category.name)}
                      </ListItemIcon>
                      <ListItemText primary={category.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addTask}
                disabled={loading}
                size="large"
              >
                Add Task
              </Button>
            </div>
          </Paper>
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <List className="bg-white rounded-lg shadow">
              {filteredTasks.map((task) => (
                <ListItem key={Number(task.id)} className="border-b last:border-b-0">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mr-2"
                  />
                  <ListItemIcon>
                    {getCategoryIcon(task.category)}
                  </ListItemIcon>
                  <ListItemText
                    primary={task.description}
                    secondary={task.category}
                    className={task.completed ? 'line-through text-gray-500' : ''}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Container>
      </div>
      <Snackbar
        open={error !== null}
        message={error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
      />
    </div>
  );
};

export default App;
