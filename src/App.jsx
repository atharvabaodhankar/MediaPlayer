import { useState, useRef, useEffect } from 'react';
import { FaFileUpload, FaTrashAlt } from 'react-icons/fa';
import './App.css';

function App() {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const mediaRef = useRef(null);

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, mediaSrc]);

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
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

  return (
    <div className="media-app">
      <h1>🎵 Online Media Player 🎬</h1>
      <div className="controls">
        <label htmlFor="file-upload" className="custom-file-upload">
          <FaFileUpload /> Select Media File
        </label>
        <input id="file-upload" type="file" accept="video/*,audio/*" onChange={handleMediaUpload} style={{ display: 'none' }} />
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
          <video controls src={mediaSrc} className="player" ref={mediaRef} />
        )}
        {mediaType === 'audio' && mediaSrc && (
          <audio controls src={mediaSrc} className="player" ref={mediaRef} />
        )}
        {!mediaSrc && (
          <p className="placeholder-text">Upload a video or audio file to start playing!</p>
        )}
      </div>
    </div>
  );
}

export default App;
