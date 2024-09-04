import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Toolbar, Typography, Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Checkbox, CircularProgress } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Task {
  id: bigint;
  description: string;
  completed: boolean;
  completionDate: bigint | null;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
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

  const addTask = async () => {
    if (newTask.trim() === '') return;
    setLoading(true);
    try {
      await backend.addTask(newTask);
      setNewTask('');
      await fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static" className="bg-blue-600">
        <Toolbar>
          <Typography variant="h6" className="flex-grow">
            Task List App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" className="mt-8">
        <div className="mb-4 flex">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="mr-2"
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addTask}
            disabled={loading}
          >
            Add
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <List className="bg-white rounded-lg shadow">
            {tasks.map((task) => (
              <ListItem key={Number(task.id)} className="border-b last:border-b-0">
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mr-2"
                />
                <ListItemText
                  primary={task.description}
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
  );
};

export default App;
