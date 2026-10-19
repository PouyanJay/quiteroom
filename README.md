# Atelier — Quiet Room

A browser music studio with a dimensional keyboard, warm glass controls, live instruments, a compact sequencer, and falling-note practice.

## Run locally

Use Python 3 to serve the app:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Serve over HTTP rather than opening index.html directly so guitar samples can load. No build step or API key is required. MIDI device access requires a supported browser and localhost or HTTPS.

## Development

All application source is in `dist/`; despite its name, it is edited directly.

- `app.js`: instruments, audio, MIDI, recording, sequencing, lessons, import/export, persistence.
- `console.js`: room layout and physical control rail.
- `glass.js`: on-glass dialogs, toolbars, track/settings drawers, navigation.
- `key-input.js`: perspective keyboard pointer input.
- `resonator.js`: Play mode visualization.
- `style.css`, `console.css`, `depth.css`, `glass.css`: styles in cascade order; later files override earlier ones.
- `assets/`: room imagery and bundled guitar samples.
- `tests/`: Node tests with mocked DOM and audio.

Node.js 22+ is recommended for development checks:

```sh
npm install
npm test
```

The tests verify logic, not browser rendering or audible sound quality. Manually check keyboard press/release, Play/Learn transport, sample loading, MIDI import, and toolbar placement after relevant changes.

The studio starts in Play mode. Sequence mode has separate Tracks and Settings drawers. Learn mode offers MIDI/audio import, listening, speed control, and wait-for-key practice. Sequence data is saved locally in the browser; it is not synced between devices.

## Audio and limitations

Guitar uses 88 bundled FluidR3 steel-string samples, loaded and decoded on first use. Other instruments use Web Audio synthesis. Sample attribution and license links are in `dist/assets/GUITAR-CREDITS.txt` and the app Help view.

Audio-to-note transcription is experimental, monophonic, and limited to the first 60 seconds. For exact notes, chords, and timing, import MIDI. The sequencer uses three tracks and a two-bar, 16-step loop.

## Hosting

Deploy the `dist/` folder to a static HTTPS host. No backend is required. GitHub changes do not automatically deploy to the existing ChatGPT Site.

Current hosted studio: https://atelier-keys-pouyan.jahangiri-pouyan.chatgpt.site

## Continuing with a coding assistant

Ask the assistant to read this README and inspect the existing CSS cascade before making changes. Preserve the warm, minimal glass style, icon-based controls, and Play mode default. Keep auxiliary UI on the glass. Update the asset version query strings in `dist/index.html` after changes to avoid stale browser caches.

## License

Use the MIT LICENSE already present in PouyanJay/quiteroom. Guitar samples retain their separate CC BY 3.0 license; see dist/assets/GUITAR-CREDITS.txt.
