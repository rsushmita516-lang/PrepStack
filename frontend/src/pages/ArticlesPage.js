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

const ArticlesPage = () => {
  const { backendUser, loading } = useAuth();
  const [articles, setArticles] = useState([]);
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
    }
  }, [backendUser]);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
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
    } catch (error) {
      console.error('Error creating article:', error);
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
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await api.delete(`/articles/${articleId}`);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
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
    } catch (error) {
      console.error('Error duplicating article:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!backendUser) return <div>Please log in</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Articles
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your saved articles appear below. Use the button in the bottom-right to add a new one.
      </Typography>

      <Dialog open={openCreate} onClose={closeCreateDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Share an Article or Resource
          <IconButton onClick={closeCreateDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateArticle} noValidate>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Content"
                value={newArticle.content}
                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                fullWidth
                multiline
                minRows={4}
                required
              />
              <TextField
                label="Tags (comma-separated)"
                value={newArticle.tags}
                onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
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
        {articles.map((article) => {
          const isEditing = editingId === article._id;
          return (
            <Grid item xs={12} md={10} key={article._id}>
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
                        label="Content"
                        value={editingValues.content}
                        onChange={(e) => setEditingValues({ ...editingValues, content: e.target.value })}
                        fullWidth
                        multiline
                        minRows={4}
                      />
                      <TextField
                        label="Tags (comma-separated)"
                        value={editingValues.tags}
                        onChange={(e) => setEditingValues({ ...editingValues, tags: e.target.value })}
                        fullWidth
                      />
                    </Stack>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {article.content}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
                        {(article.tags || []).map((tag) => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        By: {article.author?.displayName || article.author?.email}
                      </Typography>
                    </>
                  )}
                </CardContent>
                <Divider />
                <CardActions>
                  {isEditing ? (
                    <>
                      <Button size="small" onClick={() => handleSaveEdit(article._id)}>
                        Save
                      </Button>
                      <Button size="small" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="small" onClick={() => startEditing(article)}>
                        Edit
                      </Button>
                      <Button size="small" onClick={() => handleDuplicateArticle(article)}>
                        Save as New
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
    </Box>
  );
};

export default ArticlesPage;
