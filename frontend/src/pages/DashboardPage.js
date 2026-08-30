import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Stack,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

const DashboardPage = () => {
  const { backendUser, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (backendUser) {
      fetchStats();
    } else {
      setPageLoading(false);
    }
  }, [backendUser]);

  const fetchStats = async () => {
    try {
      setPageLoading(true);
      setError('');
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Unable to load your stats right now.');
    } finally {
      setPageLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!backendUser) return <Typography>Please log in</Typography>;

  const tagEntries = stats ? Object.entries(stats.tagCounts || {}) : [];
  const totalSolved = tagEntries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <Box
      sx={{
        py: 2,
        background: 'linear-gradient(180deg, #dff4ff 0%, #cfeeff 28%, #eaf7ff 100%)',
        borderRadius: 0,
      }}
    >
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
            border: '1px solid rgba(37,99,235,0.12)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1.4 }}>
                Dashboard
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontWeight: 800, letterSpacing: '-0.05em' }}>
                Welcome back, {backendUser.displayName || backendUser.email}.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 620 }}>
                Stay consistent. Keep tracking your practice, save your learnings, and keep shipping progress.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
              <Button component={Link} to="/problems" variant="contained" startIcon={<AddCircleOutlineIcon />}>
                Add Problem
              </Button>
              <Button component={Link} to="/articles" variant="outlined" startIcon={<ArticleIcon />}>
                Add Article
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'primary.light' }}>
                    <SchoolRoundedIcon color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Solved problems</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{totalSolved}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'secondary.light' }}>
                    <TrendingUpRoundedIcon sx={{ color: 'secondary.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Skill tags</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{tagEntries.length}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'warning.light' }}>
                    <EmojiEventsRoundedIcon sx={{ color: 'warning.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Badges</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{stats?.badges?.length || 0}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <DashboardIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Topic momentum</Typography>
              </Stack>

              {pageLoading ? (
                <LinearProgress />
              ) : tagEntries.length > 0 ? (
                <Stack spacing={2}>
                  {tagEntries.map(([tag, count]) => (
                    <Box key={tag}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                        <Chip label={tag} size="small" color="primary" variant="outlined" />
                        <Typography variant="body2" color="text.secondary">{count}</Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((count / Math.max(totalSolved || 1, 1)) * 100, 100)}
                        sx={{ height: 8, borderRadius: 999 }}
                      />
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No problem-solving stats yet. Start adding problems to build your practice streak.
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Badges earned</Typography>

              {stats && stats.badges && stats.badges.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {stats.badges.map((badge) => (
                    <Chip key={badge} label={badge} color="secondary" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No badges yet. Keep solving problems to unlock milestones.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default DashboardPage;
