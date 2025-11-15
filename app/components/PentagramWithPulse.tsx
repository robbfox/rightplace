"use client";

import { useEffect, useRef, useState } from "react";

interface PentagramWithPulseProps {
  bpm?: number;          // visual tempo (step movement)
  soundBpm?: number;     // kick drum tempo
  size?: number;         // canvas size
  radius?: number;       // pentagram radius
}

export default function PentagramWithPulse({
  bpm = 62,
  soundBpm = 124,
  size = 1000,
  radius = 420
}: PentagramWithPulseProps) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const [started, setStarted] = useState(false);
  const [stopped, setStopped] = useState(false);

  function handleStart() {
    setStopped(false);
    setStarted(true);
  }

  function handleStop() {
    setStopped(true);
    setStarted(false);
    if (audioRef.current) {
      audioRef.current.close();  // fully stop audio
      audioRef.current = null;
    }
  }

  useEffect(() => {
    if (!started || stopped) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const audio = new AudioCtx();
    audioRef.current = audio;

    // Soft kick drum sound
    function playKick() {
      const osc = audio.createOscillator();
      const gain = audio.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(60, audio.currentTime);

      gain.gain.setValueAtTime(0.6, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(audio.destination);

      osc.start(audio.currentTime);
      osc.stop(audio.currentTime + 0.15);
    }

    // AUDIO SCHEDULER
    const soundBeatDuration = 60 / soundBpm;
    let nextSoundBeat = audio.currentTime + 0.1;

    function scheduler() {
      if (stopped) return;
      while (nextSoundBeat < audio.currentTime + 0.1) {
        playKick();
        nextSoundBeat += soundBeatDuration;
      }
      requestAnimationFrame(scheduler);
    }

    scheduler();

    // VISUALS (step movement)
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const beatsPerMeasure = 5;
    const visualBeatDuration = 60 / bpm;

    let lastStepTime = audio.currentTime;
    let currentStep = 0; // 0..4 (five star points)

    // Precompute star points for stepping
    const starPoints: { x: number; y: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      starPoints.push({
        x: size / 2 + radius * Math.cos(angle),
        y: size / 2 + radius * Math.sin(angle),
      });
    }

    function drawStar() {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(starPoints[i].x, starPoints[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    function animate() {
      if (stopped) return;

      const now = audio.currentTime;

      // Step forward once every beat
      if (now - lastStepTime >= visualBeatDuration) {
        currentStep = (currentStep + 1) % 5;
        lastStepTime = now;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawStar();

      // draw dot at current star point
      ctx.beginPath();
      ctx.arc(starPoints[currentStep].x, starPoints[currentStep].y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      requestAnimationFrame(animate);
    }

    animate();

  }, [started, stopped, bpm, soundBpm, size, radius]);

  return (
    <div style={{ textAlign: "center" }}>
      {!started && (
        <button
          onClick={handleStart}
          style={{
            padding: "20px 40px",
            marginBottom: "20px",
            fontSize: "24px",
            cursor: "pointer"
          }}
        >
          Start
        </button>
      )}

      {started && (
        <button
          onClick={handleStop}
          style={{
            padding: "20px 40px",
            marginBottom: "20px",
            fontSize: "24px",
            background: "#333",
            color: "white",
            cursor: "pointer"
          }}
        >
          Stop
        </button>
      )}

      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          background: "black",
          borderRadius: "16px",
          maxWidth: "100%",
          marginTop: "20px"
        }}
      />
    </div>
  );
}
