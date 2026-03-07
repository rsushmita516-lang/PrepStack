import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';

const DashboardPage = () => {
  const { backendUser, loading } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (backendUser) {
      fetchStats();
    }
  }, [backendUser]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!backendUser) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {backendUser.displayName || backendUser.email}!</h1>
      {stats && (
        <div>
          <h2>Your Stats</h2>
          <div>
            <h3>Problems Solved by Tag:</h3>
            <ul>
              {Object.entries(stats.tagCounts).map(([tag, count]) => (
                <li key={tag}>{tag}: {count}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Badges:</h3>
            <ul>
              {stats.badges.map((badge, index) => (
                <li key={index}>{badge}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;