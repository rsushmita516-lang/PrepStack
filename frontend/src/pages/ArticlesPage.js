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
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

const ArticlesPage = () => {
  const { backendUser, loading } = useAuth();
  const [articles, setArticles] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [openCreate, setOpenCreate] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({
    title: '',
    content: '',
    tags: '',
  });

  useEffect(() => {
    if (backendUser) {
      fetchArticles();
    } else {
      setPageLoading(false);
    }
  }, [backendUser]);

  const fetchArticles = async () => {
    try {
      setPageLoading(true);
      setError('');
      const response = await api.get('/articles');
      setArticles(response.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Unable to load your saved articles.');
    } finally {
      setPageLoading(false);
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = newArticle.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      await api.post('/articles', { ...newArticle, tags: tagsArray });
      setNewArticle({ title: '', content: '', tags: '' });
      setOpenCreate(false);
      fetchArticles();
    } catch (err) {
      console.error('Error creating article:', err);
      setError('Could not save the article.');
    }
  };

  const openCreateDialog = () => setOpenCreate(true);
  const closeCreateDialog = () => {
    setOpenCreate(false);
    setNewArticle({ title: '', content: '', tags: '' });
  };

  const startEditing = (article) => {
    setEditingId(article._id);
    setEditingValues({
      title: article.title,
      content: article.content,
      tags: (article.tags || []).join(', '),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValues({ title: '', content: '', tags: '' });
  };

  const handleSaveEdit = async (articleId) => {
    try {
      const tagsArray = editingValues.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      await api.put(`/articles/${articleId}`, {
        title: editingValues.title,
        content: editingValues.content,
        tags: tagsArray,
      });
      cancelEditing();
      fetchArticles();
    } catch (err) {
      console.error('Error saving article:', err);
      setError('Could not update the article.');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await api.delete(`/articles/${articleId}`);
      fetchArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Could not delete the article.');
    }
  };

  const handleDuplicateArticle = async (article) => {
    try {
      const tagsArray = (article.tags || []).slice();
      await api.post('/articles', {
        title: article.title,
        content: article.content,
        tags: tagsArray,
      });
      fetchArticles();
    } catch (err) {
      console.error('Error duplicating article:', err);
      setError('Could not duplicate the article.');
    }
  };

  if (loading) return <Box sx={{ py: 6 }}><LinearProgress /></Box>;
  if (!backendUser) return <Typography>Please log in</Typography>;

  return (
    <Box sx={{ py: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1.4 }}>
            Knowledge base
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.05em' }}>
            Saved articles
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Add article
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Dialog open={openCreate} onClose={closeCreateDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Share a useful article
          <IconButton onClick={closeCreateDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateArticle} noValidate>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField label="Title" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} fullWidth required />
              <TextField label="Content" value={newArticle.content} onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })} fullWidth multiline minRows={4} required />
              <TextField label="Tags (comma-separated)" value={newArticle.tags} onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })} fullWidth />
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
      ) : articles.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <MenuBookRoundedIcon color="primary" sx={{ mb: 2, fontSize: 48 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>No articles saved yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Save the resources you want to revisit later while preparing for interviews.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {articles.map((article) => {
            const isEditing = editingId === article._id;
            return (
              <Grid item xs={12} md={6} key={article._id}>
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
                        <TextField label="Content" value={editingValues.content} onChange={(e) => setEditingValues({ ...editingValues, content: e.target.value })} fullWidth multiline minRows={4} />
                        <TextField label="Tags (comma-separated)" value={editingValues.tags} onChange={(e) => setEditingValues({ ...editingValues, tags: e.target.value })} fullWidth />
                      </Stack>
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                          {article.content}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                          {(article.tags || []).map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          By: {article.author?.displayName || article.author?.email || 'Unknown author'}
                        </Typography>
                      </>
                    )}
                  </CardContent>

                  <Divider />
                  <CardActions sx={{ p: 2, flexWrap: 'wrap', gap: 1 }}>
                    {isEditing ? (
                      <>
                        <Button size="small" variant="contained" onClick={() => handleSaveEdit(article._id)}>
                          Save
                        </Button>
                        <Button size="small" onClick={cancelEditing}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="small" variant="outlined" onClick={() => startEditing(article)}>
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => handleDuplicateArticle(article)}>
                          Duplicate
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDeleteArticle(article._id)}>
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

export default ArticlesPage;
