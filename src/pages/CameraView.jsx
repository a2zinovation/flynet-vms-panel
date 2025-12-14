import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import VideoStreamPlayer from '../components/VideoStreamPlayer';
import { cameraService } from '../services/cameras';

export default function CameraView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchCamera();
  }, [id]);

  const fetchCamera = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await cameraService.getById(id);
      const cameraData = response.data || response;
      setCamera(cameraData);
    } catch (err) {
      console.error('Error fetching camera:', err);
      setError(err.message || 'Failed to load camera');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchCamera();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !camera) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Camera not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/app/cameras')}
          sx={{ mt: 2 }}
        >
          Back to Cameras
        </Button>
      </Box>
    );
  }

  // Get stream URL from camera - backend should provide HLS endpoint
  const streamUrl = camera.stream_url || camera.rtsp_url || camera.rtmp_url || null;
  const protocol = camera.protocol || 'RTSP';

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <HomeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">/</Typography>
        <Link to="/app/cameras" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" sx={{ color: 'primary.main', cursor: 'pointer' }}>
            Cameras
          </Typography>
        </Link>
        <Typography variant="body2" color="text.secondary">/</Typography>
        <Typography variant="body2" color="text.secondary">
          {camera.name}
        </Typography>
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {camera.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={camera.protocol || 'RTSP'} 
              color="primary" 
              size="small" 
            />
            <Chip 
              label={camera.status === 'online' ? 'Online' : 'Offline'} 
              color={camera.status === 'online' ? 'success' : 'error'}
              size="small" 
            />
            <Chip 
              label={camera.server || 'FlynetES-01'} 
              variant="outlined" 
              size="small" 
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleRefresh} title="Refresh">
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={() => navigate(`/app/cameras/register?id=${id}`)} title="Edit">
            <EditIcon />
          </IconButton>
          <IconButton title="Settings">
            <SettingsIcon />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/app/cameras')}
          >
            Back
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Video Player */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 'calc(100vh - 300px)', minHeight: 400 }}>
            <VideoStreamPlayer
              key={refreshKey}
              streamUrl={streamUrl}
              protocol={camera.protocol || 'RTSP'}
            />
          </Paper>
        </Grid>

        {/* Camera Details */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Camera Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {camera.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Manufacturer
                </Typography>
                <Typography variant="body1">
                  {camera.manufacturer || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Protocol
                </Typography>
                <Typography variant="body1">
                  {camera.protocol || 'RTSP'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Server
                </Typography>
                <Typography variant="body1">
                  {camera.server || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Resolution
                </Typography>
                <Typography variant="body1">
                  {camera.resolution || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Storage Days
                </Typography>
                <Typography variant="body1">
                  {camera.storage_days || camera.storageDays || 0} days
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Host
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {camera.host || 'N/A'}
                </Typography>
              </Box>

              {streamUrl && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Stream URL
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      wordBreak: 'break-all', 
                      fontFamily: 'monospace', 
                      fontSize: '0.75rem',
                      bgcolor: '#f5f5f5',
                      p: 1,
                      borderRadius: 1,
                      mt: 0.5,
                    }}
                  >
                    {streamUrl}
                  </Typography>
                </Box>
              )}

              {camera.address && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {camera.address}
                  </Typography>
                </Box>
              )}

              {camera.comments && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Comments
                  </Typography>
                  <Typography variant="body2">
                    {camera.comments}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
