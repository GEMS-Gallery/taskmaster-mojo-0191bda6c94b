import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Toolbar, Typography, Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Checkbox, CircularProgress, Drawer, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

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

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [taskCategory, setTaskCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await backend.getCategories();
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0 && !taskCategory) {
        setTaskCategory(fetchedCategories[0].name);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '') return;
    setLoading(true);
    try {
      await backend.addTask(newTask, taskCategory);
      setNewTask('');
      await fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setLoading(false);
  };

  const addCategory = async () => {
    if (newCategory.trim() === '') return;
    try {
      await backend.addCategory(newCategory);
      setNewCategory('');
      await fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const toggleTask = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.completeTask(id);
      await fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
    setLoading(false);
  };

  const deleteTask = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    setLoading(false);
  };

  const filteredTasks = selectedCategory === 'All' ? tasks : tasks.filter(task => task.category === selectedCategory);

  return (
    <div className="flex min-h-screen bg-gray-100">
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
          <Typography variant="h6" className="mb-2">Categories</Typography>
          <List>
            <ListItem button onClick={() => setSelectedCategory('All')}>
              <ListItemText primary="All" />
            </ListItem>
            {categories.map((category) => (
              <ListItem button key={Number(category.id)} onClick={() => setSelectedCategory(category.name)}>
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
            color="secondary"
            onClick={addCategory}
          >
            Add Category
          </Button>
        </div>
      </Drawer>
      <div className="flex-grow">
        <AppBar position="static" className="bg-blue-600">
          <Toolbar>
            <Typography variant="h6" className="flex-grow">
              Task List App
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" className="mt-8">
          <div className="mb-4 flex flex-col">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="mb-2"
            />
            <FormControl fullWidth variant="outlined" className="mb-2">
              <InputLabel>Category</InputLabel>
              <Select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value as string)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={Number(category.id)} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={addTask}
              disabled={loading}
            >
              Add Task
            </Button>
          </div>
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
    </div>
  );
};

export default App;
