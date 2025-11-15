# Radiohead Conductor: A Visual Metronome for "Everything In Its Right Place"

This is a web-based conductor and visual metronome designed specifically for practicing the complex 10/4 time signature of Radiohead's iconic song, "Everything In Its Right Place." It provides both a rhythmic audio pulse and a clear, stepping visual guide to help musicians stay in time.

**Live Demo:** You can access the deployed application here: **[YOUR_VERCEL_DEPLOYMENT_LINK]**

![Radiohead Conductor Screenshot](https://i.imgur.com/your-screenshot.png) 
*(To get a screenshot URL, you can take a screenshot, upload it to a service like Imgur, and paste the direct link here. This is optional but highly recommended!)*

---

## The "Why": The Musician's Challenge

Radiohead's "Everything In Its Right Place" is famously written in **10/4 time** (or 5/4 depending on the interpretation), which can be challenging for musicians to internalize. Standard metronomes, with their simple clicks, often fail to capture the song's unique five-beat "stepping" feel.

This project was born out of a desire to create a more intuitive practice tool that provides:
1.  A clear, low-frequency **kick drum pulse** for the rhythmic foundation.
2.  A **visual conductor** that steps through the five main beats of the measure, providing a focal point for the musician.

## Technical Deep Dive: A Look Under the Hood

This application was built as a passion project to explore modern web technologies and the intersection of code and music. It was developed with the assistance of LLM "AI pair programmers" and is a showcase of several advanced front-end concepts.

### Core Technologies

*   **Framework:** [Next.js](https://nextjs.org/) / [Remix](https://remix.run/) *(Choose the one you used)* with [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Audio Synthesis:** The [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) is used to generate the kick drum sound from scratch using a sine wave oscillator and a gain envelope. This avoids any reliance on external audio files and provides high-precision scheduling.
*   **Animation:** The visual metronome is rendered on an HTML `<canvas>` element, with the animation loop driven by `requestAnimationFrame` for optimal performance.
*   **Deployment:** The application is deployed globally via [Vercel](https://vercel.com/).

### Architectural Highlights

The core of the application is a synchronized audio-visual engine built on modern React hooks and browser APIs.

*   **High-Precision Timing:** The `AudioContext.currentTime` serves as the high-precision "source of truth" for the entire application. Both the audio scheduler and the visual animation loop are synchronized to this clock, ensuring they never drift apart.
*   **Separation of Concerns:** The application runs two independent loops: one for scheduling audio events (`scheduler`) and one for rendering visual frames (`animate`). This is a robust pattern for building complex, real-time media applications.
*   **Clean State Management:** React's `useState` and `useRef` hooks are used to manage the application's state (e.g., `started`, `stopped`) and to hold references to browser objects like the `AudioContext` and `<canvas>` element, ensuring a clean lifecycle and preventing memory leaks.

## How to Run Locally

To run this project on your own machine:

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_GITHUB_REPO_LINK]
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd [your-project-name]
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.