import { lapsignal } from "@/data/lapsignal";

export function LapSignalArchitecture() {
  return (
    <div className="mt-8 border-t border-white/[0.07] pt-7">
      <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-blue-200/60">From telemetry to coaching</h3>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="LapSignal processing architecture">
        {lapsignal.architecture.map((stage, index) => (
          <li key={stage.label} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="mb-2 text-xs font-semibold text-white/70"><span className="mr-2 text-blue-300/60">{String(index + 1).padStart(2, "0")} →</span>{stage.label}</div>
            <p className="text-xs leading-6 text-white/40">{stage.detail}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs leading-6 text-white/40">{lapsignal.aiBoundary}</p>
    </div>
  );
}
