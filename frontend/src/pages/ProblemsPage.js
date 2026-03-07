import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';

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
      const tagsArray = newProblem.tags.split(',').map(tag => tag.trim());
      await api.post('/problems', { ...newProblem, tags: tagsArray });
      setNewProblem({ title: '', url: '', notes: '', tags: '', platform: '' });
      fetchProblems(); // Refresh list
    } catch (error) {
      console.error('Error creating problem:', error);
    }
  };

  const handleMarkSolved = async (problemId) => {
    try {
      await api.post(`/problems/${problemId}/solve`);
      fetchProblems(); // Refresh to show updated solvedBy
    } catch (error) {
      console.error('Error marking solved:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!backendUser) return <div>Please log in</div>;

  return (
    <div>
      <h1>Problems</h1>

      {/* Create Problem Form */}
      <form onSubmit={handleCreateProblem}>
        <input
          type="text"
          placeholder="Title"
          value={newProblem.title}
          onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="URL"
          value={newProblem.url}
          onChange={(e) => setNewProblem({ ...newProblem, url: e.target.value })}
          required
        />
        <textarea
          placeholder="Notes"
          value={newProblem.notes}
          onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={newProblem.tags}
          onChange={(e) => setNewProblem({ ...newProblem, tags: e.target.value })}
        />
        <input
          type="text"
          placeholder="Platform"
          value={newProblem.platform}
          onChange={(e) => setNewProblem({ ...newProblem, platform: e.target.value })}
        />
        <button type="submit">Add Problem</button>
      </form>

      {/* Problems List */}
      <ul>
        {problems.map((problem) => (
          <li key={problem._id}>
            <h3>{problem.title}</h3>
            <a href={problem.url} target="_blank" rel="noopener noreferrer">Link</a>
            <p>Tags: {problem.tags.join(', ')}</p>
            <p>Platform: {problem.platform}</p>
            <p>Notes: {problem.notes}</p>
            <p>Solved by: {problem.solvedBy.length} users</p>
            <button onClick={() => handleMarkSolved(problem._id)}>Mark as Solved</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemsPage;