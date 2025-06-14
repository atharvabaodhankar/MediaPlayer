# Online Media Player

This is a simple online media player built with React and Vite. It supports playing both video and audio files with custom controls designed to mimic the YouTube interface.

## Features

- **Custom Controls**: Play/pause, seek bar, time display, playback speed, and fullscreen toggle.
- **YouTube-like UI**: Controls appear on hover, progress bar expands on hover, and a clean, modern design.
- **Drag & Drop**: Easily upload media files by dragging and dropping them into the player area.
- **Keyboard Shortcuts**: Control playback using keyboard shortcuts (Space for play/pause, ArrowLeft/Right for seeking, +/- for playback speed, F for fullscreen).
- **Theme Toggle**: Switch between dark and light themes.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js and npm (Node Package Manager) installed.

- [Node.js](https://nodejs.org/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/atharvabaodhankar/MediaPlayer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd MediaPlayer
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5174/` (or another port if 5174 is in use).

## Usage

- **Upload Media**: Drag and drop a video or audio file onto the player area, or click "Select Media File" to browse.
- **Playback**: Click the play/pause button, or click on the video itself to toggle playback.
- **Seek**: Use the progress bar to jump to a specific point in the media.
- **Playback Speed**: Adjust the playback speed using the dropdown menu.
- **Fullscreen**: Toggle fullscreen mode using the fullscreen button or the `F` key.
- **Keyboard Shortcuts**:
  - `Space`: Play/Pause
  - `ArrowRight`: Seek forward 5 seconds
  - `ArrowLeft`: Seek backward 5 seconds
  - `+`/`-`: Increase/Decrease playback speed
  - `F`: Toggle Fullscreen

## Project Structure

```
MediaPlayer/
├── public/
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)
- CSS

## License

This project is open source and available under the MIT License.
