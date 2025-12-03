import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Alert,
  Chip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

const rtspTemplates = [
  { manufacturer: 'Tenda', model: 'IT7-L PCS', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/profile0' },
  { manufacturer: 'Tecvoz – TW', model: 'Câmeras IP', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/profile1' },
  { manufacturer: 'Tecvoz – TW', model: 'DVR/NVR', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/chID=1&streamType=main&linkType=tcpa' },
  { manufacturer: 'Tecvoz – T1/THK', model: 'DVR/NVR', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/Streaming/Channels/01' },
  { manufacturer: 'Tecvoz - TVZ', model: 'DVR', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp' },
  { manufacturer: 'Tecvoz - Tecvoz TV', model: 'Cameras IP', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=1' },
  { manufacturer: 'Tecvoz – T1/THK', model: 'Câmeras IP', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/Streaming/Channels/101' },
  { manufacturer: 'Tecvoz – ICB Inteligente', model: 'Câmeras IP', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/mode=real&idc=1&ids=1' },
  { manufacturer: 'Alive', model: 'Generic', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp?real_stream' },
  { manufacturer: 'Axis', model: 'Generic', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/axis-media/media.amp?videocodac=h264' },
  { manufacturer: 'Clear', model: 'Generic', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp' },
  { manufacturer: 'Dahua', model: 'Generic', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp?' },
  { manufacturer: 'Dahua', model: 'IMOU', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/cam/realmonitor?channel=1&subtype=0' },
  { manufacturer: 'Foscan', model: 'Generic', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/videoMain' },
  { manufacturer: 'Greatek', model: 'Generic', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp' },
  { manufacturer: 'GIGA', model: 'Format 1', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp' },
  { manufacturer: 'HDL', model: 'Generic', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp' },
  { manufacturer: 'Hikvision', model: 'Format 1', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/h264/ch1/main/av_stream' },
  { manufacturer: 'Hikvision', model: 'Format 2', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/Streaming/Channels/101' },
  { manufacturer: 'HeroSpeed DVR', model: 'Generic', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/snap.jpg' },
  { manufacturer: 'JFL', model: 'Generic', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/h264/ch1/main/av_stream' },
  { manufacturer: 'Intelbras', model: 'Format 1', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/cam/realmonitor?channel=1&subtype=0' },
  { manufacturer: 'Intelbras', model: 'Format 2', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp?' },
  { manufacturer: 'Jortan', model: 'Generic', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp' },
  { manufacturer: 'LG', model: 'Generic', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/Master-0' },
  { manufacturer: 'LuxVision', model: 'Generic', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp' },
  { manufacturer: 'Multilaser', model: 'Generic', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/H264?ch=1&subtype=0' },
  { manufacturer: 'Venetian', model: 'Format 1', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp?' },
  { manufacturer: 'Venetian', model: 'Format 2', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif' },
  { manufacturer: 'Vivotek', model: 'Generic', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/live.sdp' },
  { manufacturer: 'TWG', model: 'Generic', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp?' },
  { manufacturer: 'Zavio', model: 'Generic', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/video.pro1' },
  { manufacturer: 'RTSP Generic', model: 'Format 1', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT' },
  { manufacturer: 'RTSP Generic', model: 'Format 2', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/h264?channel=1' },
  { manufacturer: 'RTSP Generic', model: 'Format 3', template: 'rtsp://DOMAIN:PORT/user=USER&password=PASSWORD&channel=1&stream=0.sdp' },
  { manufacturer: 'RTSP Generic', model: 'Format 4', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/onvif1' },
  { manufacturer: 'EZView', model: 'Main Stream', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/unicast/c1/s1/live' },
  { manufacturer: 'EZView', model: 'Sub Stream', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/unicast/c1/s2/live' },
  { manufacturer: 'EZView', model: 'IPC Main Stream', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/media/video1' },
  { manufacturer: 'EZView', model: 'IPC Sub Stream', template: 'rtsp://USER:PASSWORD@DOMAIN:PORT/media/video2' },
];

export default function RTSPs() {
  const [user, setUser] = useState('admin');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('192.168.1.100');
  const [port, setPort] = useState('554');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return rtspTemplates;
    const query = searchQuery.toLowerCase();
    return rtspTemplates.filter(
      (t) =>
        t.manufacturer.toLowerCase().includes(query) ||
        t.model.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const buildRTSPUrl = (template) => {
    return template
      .replace('USER', user)
      .replace('PASSWORD', password)
      .replace('DOMAIN', domain)
      .replace('PORT', port);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <HomeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">
          /
        </Typography>
        <Typography variant="body2" color="text.secondary">
          RTSPs Address List
        </Typography>
      </Box>

      {/* Page Title */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        RTSPs Address List
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Fill in the fields below and then copy the generated RTSP link according to the manufacturer's brand.
        Use it when registering a new camera on the platform.
      </Alert>

      {/* Input Fields */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="User"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="admin"
              helperText="Username to access the camera"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
              helperText="Password for camera access"
              type="password"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="192.168.1.100 or my-camera.ddns.com"
              helperText="Network IP address or DDNS"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="554"
              helperText="RTSP port (default: 554)"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search manufacturer or model..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Templates Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><strong>Manufacturer</strong></TableCell>
              <TableCell><strong>Model/Type</strong></TableCell>
              <TableCell><strong>RTSP URL Template</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTemplates.map((item, index) => {
              const generatedUrl = buildRTSPUrl(item.template);
              return (
                <TableRow key={index} hover>
                  <TableCell>
                    <Chip label={item.manufacturer} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{item.model}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        bgcolor: '#f9f9f9',
                        p: 1,
                        borderRadius: 1,
                        wordBreak: 'break-all',
                      }}
                    >
                      {generatedUrl}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant={copiedIndex === index ? 'contained' : 'outlined'}
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard(generatedUrl, index)}
                      color={copiedIndex === index ? 'success' : 'primary'}
                    >
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredTemplates.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No manufacturers found matching "{searchQuery}"
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          component={Link}
          to="/app/cameras/register"
        >
          Register New Camera
        </Button>
      </Box>
    </Box>
  );
}
