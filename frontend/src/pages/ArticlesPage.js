import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';

const ArticlesPage = () => {
  const { backendUser, loading } = useAuth();
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
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
      const tagsArray = newArticle.tags.split(',').map(tag => tag.trim());
      await api.post('/articles', { ...newArticle, tags: tagsArray });
      setNewArticle({ title: '', content: '', tags: '' });
      fetchArticles(); // Refresh list
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!backendUser) return <div>Please log in</div>;

  return (
    <div>
      <h1>Articles</h1>

      {/* Create Article Form */}
      <form onSubmit={handleCreateArticle}>
        <input
          type="text"
          placeholder="Title"
          value={newArticle.title}
          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={newArticle.content}
          onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={newArticle.tags}
          onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
        />
        <button type="submit">Add Article</button>
      </form>

      {/* Articles List */}
      <ul>
        {articles.map((article) => (
          <li key={article._id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <p>Tags: {article.tags.join(', ')}</p>
            <p>By: {article.author.displayName || article.author.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticlesPage;