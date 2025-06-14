import { useState } from 'react';
import './App.css';

function App() {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);

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
    }
  };

  return (
    <div className="media-app">
      <h1>🎵 Online Media Player 🎬</h1>
      <input type="file" accept="video/*,audio/*" onChange={handleMediaUpload} />

      <div className="player-box">
        {mediaType === 'video' && (
          <video controls src={mediaSrc} className="player" />
        )}
        {mediaType === 'audio' && (
          <audio controls src={mediaSrc} className="player" />
        )}
      </div>
    </div>
  );
}

export default App;
