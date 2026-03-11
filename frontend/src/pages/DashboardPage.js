import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';

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
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {backendUser.displayName || backendUser.email}!
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Problem Solving Stats
            </Typography>
            {stats ? (
              <List>
                {Object.entries(stats.tagCounts).map(([tag, count]) => (
                  <ListItem key={tag} disableGutters>
                    <ListItemText primary={`${tag}: ${count}`} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">No stats available.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Badges
            </Typography>
            {stats && stats.badges.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {stats.badges.map((badge) => (
                  <Chip key={badge} label={badge} color="secondary" />
                ))}
              </Box>
            ) : (
              <Typography variant="body2">No badges earned yet. Keep solving!</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
