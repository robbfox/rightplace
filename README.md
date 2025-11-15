# Radiohead Conductor: A Visual Metronome for "Everything In Its Right Place"

This is a web-based conductor and visual metronome designed specifically for practicing the complex 10/4 time signature of Radiohead's iconic song, "Everything In Its Right Place." It provides both a rhythmic audio pulse and a clear, stepping visual guide to help musicians stay in time.

**Live Demo:** [https://rightplace-black.vercel.app/](https://rightplace-black.vercel.app/)

![Radiohead Conductor Screenshot](https://i.postimg.cc/Yqtv70C1/Screenshot-(98).png)

---

## The "Why": The Musician's Challenge

Radiohead's "Everything In Its Right Place" is famously written in **10/4 time** (or 5/4 depending on the interpretation), which can be challenging for musicians to internalize. Standard metronomes, with their simple clicks, often fail to capture the song's unique five-beat "stepping" feel.

This project was born out of a desire to create a more intuitive practice tool that provides:
1. A clear, low-frequency **kick drum pulse** for the rhythmic foundation (124 BPM)
2. A **visual conductor** that steps through the five main beats of the measure at half-tempo (62 BPM), providing a focal point for the musician

The pentagram (five-pointed star) serves as both a visual metaphor for the song's five-beat structure and an intuitive guide where a red dot "walks" from point to point with each beat.

---

## Technical Deep Dive: A Look Under the Hood

This application was built as a passion project to explore modern web technologies and the intersection of code and music. It was developed with the assistance of Claude (Anthropic's AI assistant) and showcases several advanced front-end concepts.

### Core Technologies

- **Framework:** [Next.js 16](https://nextjs.org/) with [React](https://reactjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Audio Synthesis:** The [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) is used to generate the kick drum sound from scratch using a sine wave oscillator and a gain envelope. This avoids any reliance on external audio files and provides high-precision scheduling.
- **Animation:** The visual metronome is rendered on an HTML `<canvas>` element, with the animation loop driven by `requestAnimationFrame` for optimal performance and smooth 60fps rendering.
- **Deployment:** The application is deployed globally via [Vercel](https://vercel.com/) with edge caching.

### Architectural Highlights

The core of the application is a synchronized audio-visual engine built on modern React hooks and browser APIs.

#### High-Precision Timing
The `AudioContext.currentTime` serves as the high-precision "source of truth" for the entire application. Both the audio scheduler and the visual animation loop are synchronized to this clock, ensuring they never drift apart—even over extended practice sessions.

#### Dual-Loop Architecture
The application runs two independent loops:
- **Audio Scheduler Loop:** Uses a look-ahead scheduler that queues kick drum hits just before they're needed, ensuring rock-solid timing even under CPU load
- **Visual Animation Loop:** Runs at 60fps via `requestAnimationFrame`, checking the audio clock to determine when to advance the red dot to the next point

This separation of concerns is a robust pattern for building complex, real-time media applications and prevents the visual frame rate from affecting audio timing.

#### Clean State Management
React's `useState` and `useRef` hooks manage the application's state and hold references to browser objects:
- `useState` for UI state (`started`, `stopped`)
- `useRef` for persistent objects (`AudioContext`, `<canvas>` element)
- Proper cleanup in `useEffect` to prevent memory leaks when stopping

#### Configurable Parameters
The component accepts props for easy experimentation:
```typescript
<PentagramWithPulse 
  bpm={62}         // Visual step tempo
  soundBpm={124}   // Audio pulse tempo
  size={1000}      // Canvas dimensions
  radius={420}     // Pentagram size
/>
```

---

## How to Run Locally

To run this project on your own machine:

1. **Clone the repository:**
   ```bash
   git clone git@github.com:robbfox/rightplace.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd rightplace
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

---

## Usage Tips

- Click **Start** to begin both the audio pulse and visual animation
- The red dot moves to a new point every **62 BPM** (one beat per 0.968 seconds)
- The kick drum sounds at **124 BPM** (twice as fast as the visual)
- Use the visual conductor as a guide while playing along with the original track
- Click **Stop** to cleanly shut down the audio context

---

## Future Enhancements

Potential ideas for future development:
- [ ] Add adjustable BPM controls in the UI
- [ ] Include additional sound options (hi-hat, snare)
- [ ] Add accent markers for downbeats
- [ ] Mobile-responsive controls and touch gestures
- [ ] Preset configurations for other time signatures
- [ ] Visual effects synchronized with the audio pulse

---

## Contributing

This is an open-source project and contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests with improvements
- Fork the project for your own experiments

---

## License

MIT License - feel free to use this code for your own projects!

---

## Acknowledgments

- **Radiohead** for creating music that inspires technical and creative challenges
- **Claude (Anthropic)** for AI-assisted development and debugging
- The Web Audio API community for excellent documentation and examples

---

*Built with ❤️ for musicians who love to code and coders who love music.*