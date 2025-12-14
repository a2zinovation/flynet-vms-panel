import React, { useEffect, useRef, useState } from 'react';
import { Box, Alert, CircularProgress, Typography, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

/**
 * VideoStreamPlayer Component
 * 
 * Plays RTSP/RTMP streams. In production, you'll need a backend service to:
 * 1. Transcode RTSP/RTMP to HLS (HTTP Live Streaming)
 * 2. Or use WebRTC for low-latency streaming
 * 3. Or use a streaming server like Ant Media Server, Wowza, or ffmpeg
 * 
 * For now, this component shows how to integrate with HLS.js for HLS streams
 */
export default function VideoStreamPlayer({ streamUrl, protocol = 'RTSP', poster }) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (!streamUrl) {
      setError('No stream URL provided');
      setLoading(false);
      return;
    }

    // For production: Convert RTSP/RTMP to HLS
    // Your backend should expose an HLS endpoint like: /api/stream/hls/{camera_id}/playlist.m3u8
    const hlsUrl = convertToHLSUrl(streamUrl, protocol);

    // Always try to load as HLS (either direct .m3u8 URL or converted)
    loadHLSStream(hlsUrl);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl, protocol]);

  const convertToHLSUrl = (url, protocol) => {
    const DEFAULT_STREAM = 'https://stream.pinkdreams.store/live/office_cam_01/index.m3u8';
    
    // If no URL provided, use default stream
    if (!url) {
      console.log('No stream URL provided, using default stream');
      return DEFAULT_STREAM;
    }
    
    console.log('Original Stream URL:', url, 'Protocol:', protocol);
    
    // If it's already an HTTP/HTTPS HLS URL (.m3u8), return as is
    if (url && (url.startsWith('http://') || url.startsWith('https://')) && url.includes('.m3u8')) {
      console.log('Using direct HLS URL:', url);
      return url;
    }
    
    // If it's an RTSP/RTMP URL, use default stream instead
    if (url && (url.startsWith('rtsp://') || url.startsWith('rtmp://'))) {
      console.warn('RTSP/RTMP streams require backend transcoding. Using default stream instead:', url);
      return DEFAULT_STREAM;
    }
    
    // If it's a relative path or other format with .m3u8, construct full URL
    if (url.includes('.m3u8')) {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://api.pinkdreams.store/api';
      const fullUrl = url.startsWith('/') ? `${API_BASE}${url}` : url;
      console.log('Constructed HLS URL:', fullUrl);
      return fullUrl;
    }
    
    // For any other invalid format, use default stream
    console.warn('Invalid stream URL format, using default stream');
    return DEFAULT_STREAM;
  };

  const loadHLSStream = async (url) => {
    try {
      if (!window.Hls) {
        // HLS.js not loaded, try loading it dynamically
        await loadHLSLibrary();
      }

      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hls.loadSource(url);
        hls.attachMedia(videoRef.current);

        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          setError(null);
          videoRef.current.play().catch(err => {
            console.log('Autoplay prevented:', err);
            setPlaying(false);
          });
        });

        hls.on(window.Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            setError(`Stream error: ${data.type} - ${data.details}`);
            setLoading(false);
          }
        });

        hlsRef.current = hls;
        setPlaying(true);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoRef.current.src = url;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setLoading(false);
          videoRef.current.play().catch(err => {
            console.log('Autoplay prevented:', err);
            setPlaying(false);
          });
        });
        setPlaying(true);
      } else {
        setError('HLS is not supported in this browser. Please use a modern browser.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load stream: ' + err.message);
      setLoading(false);
    }
  };

  const loadHLSLibrary = () => {
    return new Promise((resolve, reject) => {
      if (window.Hls) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load HLS.js'));
      document.head.appendChild(script);
    });
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      } else {
        videoRef.current.play();
        setPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (error) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000', borderRadius: 2 }}>
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>Stream Error</Typography>
          <Typography variant="body2">{error}</Typography>
          <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
            <strong>Setup Instructions:</strong><br />
            To play RTSP/RTMP streams in the browser, you need to:
            <ul style={{ marginTop: 8 }}>
              <li>Set up FFmpeg to transcode RTSP/RTMP to HLS</li>
              <li>Configure your Laravel backend to serve HLS streams</li>
              <li>Or use a streaming server like Ant Media Server or Wowza</li>
            </ul>
            See STREAM_SETUP_GUIDE.md for detailed instructions.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', bgcolor: '#000', borderRadius: 2, overflow: 'hidden' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.7)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        controls={false}
        poster={poster}
        playsInline
      />

      {/* Custom Controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          padding: 2,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <IconButton onClick={togglePlay} sx={{ color: 'white' }} size="small">
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <Box sx={{ flex: 1 }} />

        <IconButton onClick={toggleMute} sx={{ color: 'white' }} size="small">
          {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>

        <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }} size="small">
          <FullscreenIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
