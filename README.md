# Waveline

A responsive music streaming web app built with React, JavaScript and Tailwind CSS. It has a glassmorphism interface, a working audio player, playlists, favorites, search and filtering, a recently played list and a listening dashboard.

Waveline is a frontend-only app with no backend. Cover art is generated in code and every track is synthesized in the browser with the Web Audio-style WAV generator, so the app works with no external media files.

## Features

**Library**
- Artist, album and song sections on the home page
- Featured album hero and trending songs based on your own plays

**Audio player**
- Play, pause, previous, next, seek and volume controls with mute
- Shuffle and repeat modes (off, repeat all, repeat one)
- Queue panel: jump to any song, remove songs, clear the queue
- Spinning vinyl cover and equalizer bars while playing
- Browser media session metadata for lock screen and media key controls

**Organize**
- Playlists: create, add songs, remove songs and delete, saved in `localStorage`
- Favorites with a heart toggle
- Recently played history (last 12 songs) with a clear option
- Search across title, artist, album and genre, with genre chips and sorting by title, artist or newest

**Dashboard**
- Minutes listened, songs played, favorites and playlist counts
- Plays by genre and most played songs

**Design**
- Glassmorphism panels, animated gradient background and page transitions
- Fraunces and Manrope typography
- Desktop layout with sidebar and floating player, and mobile layout with a bottom nav bar and compact player
- Respects `prefers-reduced-motion`

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 18 with hooks and context |
| Build | Vite |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS 3 plus a small custom stylesheet |
| Audio | HTML5 `<audio>` element fed by procedurally generated WAV blobs |
| Storage | Browser `localStorage` |
| Fonts | Google Fonts |

## Getting started

Requires Node.js 18 or newer.

```bash
git clone https://github.com/<your-username>/waveline.git
cd waveline
npm install
npm run dev
```

Open the local URL that Vite prints (usually http://localhost:5173). To create a production build, run `npm run build`, and `npm run preview` to test it.

## Project structure

```
waveline/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx      # React entry point
    ├── App.jsx       # views, player, queue and app state
    ├── data.js       # artists, albums and songs
    ├── audio.js      # procedural audio generator (makeWav)
    └── index.css     # Tailwind directives and custom glass and animation styles
```

## Saved data

Everything is stored in your browser only.

| Key | Contents |
| --- | --- |
| `wl_favs` | Favorite song ids |
| `wl_recent` | Recently played song ids |
| `wl_playlists` | Playlists and their songs |
| `wl_stats` | Play counts and listening time |

Clear these keys in your browser's developer tools to reset the app.

## Using real music

To stream actual audio files, add a `src` URL to each song in `SONGS` and set `a.src` to that URL in the track-change effect in `App` instead of calling `makeWav()`. Replace `Cover` with `<img>` tags if you have real artwork.

## Known limitations

- Songs are generated tones, not recordings
- Data is per browser and is not synced between devices
- The queue and playlists can't be reordered by dragging yet

## Roadmap

- [ ] Drag-to-reorder for queue and playlists
- [ ] Dedicated artist and album pages
- [ ] Lyrics panel
- [ ] Real audio files and artwork
- [ ] Light theme

## License

MIT
