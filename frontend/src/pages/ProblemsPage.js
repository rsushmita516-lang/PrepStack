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
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

const ProblemsPage = () => {
  const { backendUser, loading } = useAuth();
  const [problems, setProblems] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
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
    } else {
      setPageLoading(false);
    }
  }, [backendUser]);

  const fetchProblems = async () => {
    try {
      setPageLoading(true);
      setError('');
      const response = await api.get('/problems');
      setProblems(response.data);
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError('Unable to load your problems right now.');
    } finally {
      setPageLoading(false);
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
    } catch (err) {
      console.error('Error creating problem:', err);
      setError('Could not create the problem.');
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
    } catch (err) {
      console.error('Error marking solved:', err);
      setError('Could not mark the problem as solved.');
    }
  };

  const handleDeleteProblem = async (problemId) => {
    try {
      await api.delete(`/problems/${problemId}`);
      fetchProblems();
    } catch (err) {
      console.error('Error deleting problem:', err);
      setError('Could not delete the problem.');
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
    } catch (err) {
      console.error('Error duplicating problem:', err);
      setError('Could not duplicate the problem.');
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
    } catch (err) {
      console.error('Error saving problem:', err);
      setError('Could not update the problem.');
    }
  };

  if (loading) return <Box sx={{ py: 6 }}><LinearProgress /></Box>;
  if (!backendUser) return <Typography>Please log in</Typography>;

  return (
    <Box sx={{ py: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1.4 }}>
            Problem library
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.05em' }}>
            Practice problems
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Add problem
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Dialog open={openCreate} onClose={closeCreateDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Add a new problem
          <IconButton onClick={closeCreateDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateProblem} noValidate>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField label="Title" value={newProblem.title} onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })} fullWidth required />
              <TextField label="URL" value={newProblem.url} onChange={(e) => setNewProblem({ ...newProblem, url: e.target.value })} fullWidth required />
              <TextField label="Notes" value={newProblem.notes} onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })} fullWidth multiline minRows={3} />
              <TextField label="Tags (comma-separated)" value={newProblem.tags} onChange={(e) => setNewProblem({ ...newProblem, tags: e.target.value })} fullWidth />
              <TextField label="Platform" value={newProblem.platform} onChange={(e) => setNewProblem({ ...newProblem, platform: e.target.value })} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCreateDialog}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {pageLoading ? (
        <LinearProgress />
      ) : problems.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CodeRoundedIcon color="primary" sx={{ mb: 2, fontSize: 48 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>No problems saved yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Start building your practice list by adding a new coding problem.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {problems.map((problem) => {
            const isEditing = editingId === problem._id;
            return (
              <Grid item xs={12} md={6} key={problem._id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)' },
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    {isEditing ? (
                      <Stack spacing={2}>
                        <TextField label="Title" value={editingValues.title} onChange={(e) => setEditingValues({ ...editingValues, title: e.target.value })} fullWidth />
                        <TextField label="URL" value={editingValues.url} onChange={(e) => setEditingValues({ ...editingValues, url: e.target.value })} fullWidth />
                        <TextField label="Notes" value={editingValues.notes} onChange={(e) => setEditingValues({ ...editingValues, notes: e.target.value })} fullWidth multiline minRows={3} />
                        <TextField label="Tags (comma-separated)" value={editingValues.tags} onChange={(e) => setEditingValues({ ...editingValues, tags: e.target.value })} fullWidth />
                        <TextField label="Platform" value={editingValues.platform} onChange={(e) => setEditingValues({ ...editingValues, platform: e.target.value })} fullWidth />
                      </Stack>
                    ) : (
                      <>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {problem.title}
                          </Typography>
                          {problem.platform && <Chip label={problem.platform} size="small" color="primary" variant="outlined" />}
                        </Stack>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <a href={problem.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>
                              Open problem ↗
                            </a>
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.primary' }}>
                            {problem.notes || 'No notes yet.'}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                          {(problem.tags || []).map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Solved by {problem.solvedBy?.length || 0} users
                        </Typography>
                      </>
                    )}
                  </CardContent>

                  <Divider />
                  <CardActions sx={{ p: 2, flexWrap: 'wrap', gap: 1 }}>
                    {isEditing ? (
                      <>
                        <Button size="small" variant="contained" onClick={() => handleSaveEdit(problem._id)}>
                          Save
                        </Button>
                        <Button size="small" onClick={cancelEditing}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="small" variant="outlined" onClick={() => startEditing(problem)}>
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => handleDuplicateProblem(problem)}>
                          Duplicate
                        </Button>
                        <Button size="small" variant="contained" onClick={() => handleMarkSolved(problem._id)}>
                          Mark solved
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
      )}
    </Box>
  );
};

export default ProblemsPage;
