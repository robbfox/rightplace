import PentagramWithPulse from "./components/PentagramWithPulse";

export default function Home() {
  return (
    <main style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <PentagramWithPulse bpm={62} />
    </main>
  );
}
