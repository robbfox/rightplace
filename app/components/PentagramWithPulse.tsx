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
  const schedulerIdRef = useRef<number | null>(null);

  const [started, setStarted] = useState(false);
  const [stopped, setStopped] = useState(false);

  function handleStart() {
    setStopped(false);
    setStarted(true);
  }

  function handleStop() {
    setStopped(true);
    setStarted(false);
    if (schedulerIdRef.current) {
      clearTimeout(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.close();
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
    let schedulerRunning = true;

    function scheduler() {
      if (!schedulerRunning) return;
      
      // Schedule all beats that need to happen in the next 100ms
      while (nextSoundBeat < audio.currentTime + 0.1) {
        playKick();
        nextSoundBeat += soundBeatDuration;
      }
      
      // Check again in 25ms (4 times per look-ahead window)
      schedulerIdRef.current = window.setTimeout(scheduler, 25);
    }

    scheduler();

    // VISUALS (step movement)
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const visualBeatDuration = 60 / bpm;

    const startTime = audio.currentTime;
    let currentStep = 0;

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
      if (!ctx) return;
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
      if (stopped || !ctx || !canvas) return;

      const now = audio.currentTime;
      const elapsed = now - startTime;
      
      // Calculate which step we should be on based on total elapsed time
      const calculatedStep = Math.floor(elapsed / visualBeatDuration) % 5;
      currentStep = calculatedStep;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStar();

      ctx.beginPath();
      ctx.arc(starPoints[currentStep].x, starPoints[currentStep].y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      requestAnimationFrame(animate);
    }

    animate();

    // Cleanup function
    return () => {
      schedulerRunning = false;
      if (schedulerIdRef.current) {
        clearTimeout(schedulerIdRef.current);
      }
    };

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