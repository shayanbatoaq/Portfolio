import { Sparkles } from "lucide-react";

type Props = {
  stages: { label: string; detail: string }[];
  accent: string;
  accentRgb: string;
  running?: boolean;
};

export function WorkflowStages({ stages, accent, accentRgb, running = false }: Props) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/28">
          Workflow stages
        </span>
        <Sparkles size={15} style={{ color: accent }} />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-2">
        {stages.map((stage, index) => (
          <div key={stage.label} className="contents">
            <div className="min-w-0 text-center">
              <div
                className={`mx-auto grid size-11 place-items-center rounded-full border ${
                  running ? "animate-pulse" : ""
                }`}
                style={{
                  borderColor: `rgba(${accentRgb}, .28)`,
                  background: `rgba(${accentRgb}, .08)`,
                  color: accent,
                }}
              >
                <span className="font-mono text-xs">0{index + 1}</span>
              </div>
              <div className="mt-3 truncate text-xs font-semibold text-white/72">
                {stage.label}
              </div>
              <div className="mt-1 hidden text-[10px] leading-4 text-white/25 sm:block">
                {stage.detail}
              </div>
            </div>
            {index < stages.length - 1 && (
              <div
                className="mt-[1.35rem] h-px w-5 sm:w-9"
                style={{
                  background: `linear-gradient(90deg, rgba(${accentRgb}, .55), rgba(${accentRgb}, .12))`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
