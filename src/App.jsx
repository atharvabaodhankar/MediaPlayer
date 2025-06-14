import { useState, useRef, useEffect } from 'react';
import { FaFileUpload, FaTrashAlt } from 'react-icons/fa';
import './App.css';

function App() {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const mediaRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
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
      case 'KeyF':
        e.preventDefault();
        handleFullScreenToggle();
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

    const mediaElement = mediaRef.current;
    if (mediaElement) {
      mediaElement.addEventListener('timeupdate', () => {
        setCurrentTime(mediaElement.currentTime);
      });
      mediaElement.addEventListener('loadedmetadata', () => {
        setDuration(mediaElement.duration);
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (mediaElement) {
        mediaElement.removeEventListener('timeupdate', () => {
          setCurrentTime(mediaElement.currentTime);
        });
        mediaElement.removeEventListener('loadedmetadata', () => {
          setDuration(mediaElement.duration);
        });
      }
    };
  }, [mediaSrc]);

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

  const handleSeek = (e) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = e.target.value;
      setCurrentTime(e.target.value);
    }
  };

  const handleFullScreenToggle = () => {
    if (mediaRef.current) {
        if (!document.fullscreenElement) {
            mediaRef.current.requestFullscreen().then(() => {
                setIsFullScreen(true);
            }).catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullScreen(false);
            }).catch(err => {
                console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
            });
        }
    }
};

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
        {mediaType === 'audio' && mediaSrc && (
          <audio
            controls
            src={mediaSrc}
            className="player"
            ref={mediaRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
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

      <div className="player-box" onClick={mediaType === 'video' && mediaSrc ? handlePlayPause : null}>
        {mediaType === 'video' && mediaSrc && (
          <>
            <video
              src={mediaSrc}
              className="player"
              ref={mediaRef}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="youtube-style-controls">
              <div className="progress-bar-container">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  className="youtube-progress-bar"
                  onChange={handleSeek}
                />
              </div>
              <div className="controls-buttons">
                <button onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }} className="yt-control-button">
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                <div className="time-display">
                  <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                </div>
                <div className="right-controls">
                  <select 
                    value={playbackRate} 
                    onChange={handlePlaybackRateChange}
                    onClick={(e) => e.stopPropagation()}
                    className="yt-speed-select"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFullScreenToggle();
                    }} 
                    className="yt-control-button"
                  >
                    {isFullScreen ? '⤦' : '⤢'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {mediaType === 'audio' && mediaSrc && (
          <>
            <audio
              src={mediaSrc}
              className="player audio-player"
              ref={mediaRef}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="audio-visualization">
              <div className="audio-wave"></div>
            </div>
            <div className="youtube-style-controls">
              <div className="progress-bar-container">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  className="youtube-progress-bar"
                  onChange={handleSeek}
                />
              </div>
              <div className="controls-buttons">
                <button onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }} className="yt-control-button">
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                <div className="time-display">
                  <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                </div>
                <div className="right-controls">
                  <select 
                    value={playbackRate} 
                    onChange={handlePlaybackRateChange}
                    onClick={(e) => e.stopPropagation()}
                    className="yt-speed-select"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
        {!mediaSrc && (
          <p className="placeholder-text">Drag & Drop your media file here, or click to upload!</p>
        )}
      </div>
    </div>
  );
}

export default App;
