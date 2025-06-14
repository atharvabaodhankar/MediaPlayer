import { useState, useRef, useEffect } from 'react';
import { FaFileUpload, FaTrashAlt } from 'react-icons/fa';
import './App.css';

function App() {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const mediaRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'dark';
  });

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, mediaSrc]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!mediaRef.current) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (mediaRef.current.paused) {
            mediaRef.current.play();
            setIsPlaying(true);
          } else {
            mediaRef.current.pause();
            setIsPlaying(false);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          mediaRef.current.currentTime += 5; // Seek forward 5 seconds
          break;
        case 'ArrowLeft':
          e.preventDefault();
          mediaRef.current.currentTime -= 5; // Seek backward 5 seconds
          break;
        case 'NumpadAdd':
        case 'Equal': // For '+' without numpad
          e.preventDefault();
          setPlaybackRate((prevRate) => Math.min(prevRate + 0.25, 2));
          break;
        case 'NumpadSubtract':
        case 'Minus': // For '-' without numpad
          e.preventDefault();
          setPlaybackRate((prevRate) => Math.max(prevRate - 0.25, 0.5));
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMediaUpload = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMediaSrc(url);

    if (file.type.startsWith('video')) {
      setMediaType('video');
    } else if (file.type.startsWith('audio')) {
      setMediaType('audio');
    } else {
      alert('Please upload a valid audio or video file.');
      setMediaSrc(null);
      setMediaType(null);
    }
  };

  const handleFileChange = (e) => {
    handleMediaUpload(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleMediaUpload(file);
  };

  const handleRemoveMedia = () => {
    if (mediaSrc) {
      URL.revokeObjectURL(mediaSrc);
      setMediaSrc(null);
      setMediaType(null);
      setPlaybackRate(1);
    }
  };

  const handlePlaybackRateChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handlePlayPause = () => {
    if (mediaRef.current) {
      if (mediaRef.current.paused) {
        mediaRef.current.play();
        setIsPlaying(true);
      } else {
        mediaRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div
      className={`media-app ${theme}-theme`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h1>🎵 Online Media Player 🎬</h1>
      <div className="theme-toggle-container">
        <button onClick={handleToggleTheme} className="theme-toggle-button">
          {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
        </button>
      </div>
      <div className="controls">
        <label htmlFor="file-upload" className="custom-file-upload">
          <FaFileUpload /> Select Media File
        </label>
        <input id="file-upload" type="file" accept="video/*,audio/*" onChange={handleFileChange} style={{ display: 'none' }} />
        {mediaSrc && (
          <button onClick={handleRemoveMedia} className="remove-button">
            <FaTrashAlt /> Remove Media
          </button>
        )}
      </div>

      {mediaSrc && (
        <div className="playback-controls">
          <label htmlFor="playback-speed">Playback Speed:</label>
          <select id="playback-speed" value={playbackRate} onChange={handlePlaybackRateChange}>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      )}

      <div className="player-box">
        {mediaType === 'video' && mediaSrc && (
          <video
            controls
            src={mediaSrc}
            className="player"
            ref={mediaRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
        {mediaType === 'audio' && mediaSrc && (
          <audio
            controls
            src={mediaSrc}
            className="player"
            ref={mediaRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
        {!mediaSrc && (
          <p className="placeholder-text">Drag & Drop your media file here, or click to upload!</p>
        )}
        {mediaSrc && (
          <button onClick={handlePlayPause} className="play-pause-button">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
