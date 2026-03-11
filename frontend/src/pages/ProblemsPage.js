import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const ProblemsPage = () => {
  const { backendUser, loading } = useAuth();
  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState({
    title: '',
    url: '',
    notes: '',
    tags: '',
    platform: '',
  });
  const [openCreate, setOpenCreate] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({
    title: '',
    url: '',
    notes: '',
    tags: '',
    platform: '',
  });

  useEffect(() => {
    if (backendUser) {
      fetchProblems();
    }
  }, [backendUser]);

  const fetchProblems = async () => {
    try {
      const response = await api.get('/problems');
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = newProblem.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      await api.post('/problems', { ...newProblem, tags: tagsArray });
      setNewProblem({ title: '', url: '', notes: '', tags: '', platform: '' });
      setOpenCreate(false);
      fetchProblems();
    } catch (error) {
      console.error('Error creating problem:', error);
    }
  };

  const openCreateDialog = () => setOpenCreate(true);
  const closeCreateDialog = () => {
    setOpenCreate(false);
    setNewProblem({ title: '', url: '', notes: '', tags: '', platform: '' });
  };

  const handleMarkSolved = async (problemId) => {
    try {
      await api.post(`/problems/${problemId}/solve`);
      fetchProblems();
    } catch (error) {
      console.error('Error marking solved:', error);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    try {
      await api.delete(`/problems/${problemId}`);
      fetchProblems();
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handleDuplicateProblem = async (problem) => {
    try {
      const tagsArray = (problem.tags || []).slice();
      await api.post('/problems', {
        title: problem.title,
        url: problem.url,
        notes: problem.notes,
        tags: tagsArray,
        platform: problem.platform,
      });
      fetchProblems();
    } catch (error) {
      console.error('Error duplicating problem:', error);
    }
  };

  const startEditing = (problem) => {
    setEditingId(problem._id);
    setEditingValues({
      title: problem.title,
      url: problem.url,
      notes: problem.notes || '',
      tags: (problem.tags || []).join(', '),
      platform: problem.platform || '',
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValues({ title: '', url: '', notes: '', tags: '', platform: '' });
  };

  const handleSaveEdit = async (problemId) => {
    try {
      const tagsArray = editingValues.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      await api.put(`/problems/${problemId}`, {
        title: editingValues.title,
        url: editingValues.url,
        notes: editingValues.notes,
        tags: tagsArray,
        platform: editingValues.platform,
      });
      cancelEditing();
      fetchProblems();
    } catch (error) {
      console.error('Error saving problem:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!backendUser) return <div>Please log in</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Problems
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your saved problems appear below. Use the button in the bottom-right to add a new one.
      </Typography>

      <Dialog open={openCreate} onClose={closeCreateDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Add a New Problem
          <IconButton onClick={closeCreateDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateProblem} noValidate>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={newProblem.title}
                onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="URL"
                value={newProblem.url}
                onChange={(e) => setNewProblem({ ...newProblem, url: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Notes"
                value={newProblem.notes}
                onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
                fullWidth
                multiline
                minRows={3}
              />
              <TextField
                label="Tags (comma-separated)"
                value={newProblem.tags}
                onChange={(e) => setNewProblem({ ...newProblem, tags: e.target.value })}
                fullWidth
              />
              <TextField
                label="Platform"
                value={newProblem.platform}
                onChange={(e) => setNewProblem({ ...newProblem, platform: e.target.value })}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCreateDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Fab
        color="primary"
        aria-label="open menu"
        onClick={openCreateDialog}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <MenuIcon />
      </Fab>

      <Grid container spacing={2} justifyContent="center">
        {problems.map((problem) => {
          const isEditing = editingId === problem._id;
          return (
            <Grid item xs={12} md={10} key={problem._id}>
              <Card>
                <CardContent>
                  {isEditing ? (
                    <Stack spacing={2}>
                      <TextField
                        label="Title"
                        value={editingValues.title}
                        onChange={(e) => setEditingValues({ ...editingValues, title: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="URL"
                        value={editingValues.url}
                        onChange={(e) => setEditingValues({ ...editingValues, url: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Notes"
                        value={editingValues.notes}
                        onChange={(e) => setEditingValues({ ...editingValues, notes: e.target.value })}
                        fullWidth
                        multiline
                        minRows={3}
                      />
                      <TextField
                        label="Tags (comma-separated)"
                        value={editingValues.tags}
                        onChange={(e) => setEditingValues({ ...editingValues, tags: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Platform"
                        value={editingValues.platform}
                        onChange={(e) => setEditingValues({ ...editingValues, platform: e.target.value })}
                        fullWidth
                      />
                    </Stack>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>
                        {problem.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <a href={problem.url} target="_blank" rel="noopener noreferrer">
                          View problem
                        </a>
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Platform:</strong> {problem.platform || '–'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {problem.notes || 'No notes yet.'}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
                        {(problem.tags || []).map((tag) => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Solved by {problem.solvedBy.length} users
                      </Typography>
                    </>
                  )}
                </CardContent>
                <Divider />
                <CardActions>
                  {isEditing ? (
                    <>
                      <Button size="small" onClick={() => handleSaveEdit(problem._id)}>
                        Save
                      </Button>
                      <Button size="small" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="small" onClick={() => startEditing(problem)}>
                        Edit
                      </Button>
                      <Button size="small" onClick={() => handleDuplicateProblem(problem)}>
                        Save as New
                      </Button>
                      <Button size="small" onClick={() => handleMarkSolved(problem._id)}>
                        Mark Solved
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDeleteProblem(problem._id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProblemsPage;
