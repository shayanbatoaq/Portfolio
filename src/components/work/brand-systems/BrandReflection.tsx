import type { BrandReflection as BrandReflectionData } from "@/data/brandSystems";

const REFLECTION_LABELS: Array<{
  key: keyof BrandReflectionData;
  label: string;
}> = [
  { key: "role", label: "My role" },
  { key: "requirement", label: "What the brand required" },
  { key: "strategy", label: "Platform strategy" },
  { key: "constraints", label: "Design constraints" },
  { key: "learning", label: "What I refined" },
];

export function BrandReflection({ reflection }: { reflection: BrandReflectionData }) {
  return (
    <section id="reflection" aria-labelledby="reflection-heading" className="scroll-mt-40 border-t border-white/[0.08] py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div>
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-purple-300/65">
            Behind the system
          </p>
          <h2 id="reflection-heading" className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Reflection
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/42">
            A concise view of the thinking, constraints, and iteration behind the work.
          </p>
        </div>

        <dl className="border-t border-white/[0.09]">
          {REFLECTION_LABELS.map(({ key, label }, index) => (
            <div
              key={key}
              className="grid gap-3 border-b border-white/[0.09] py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
            >
              <dt className="flex items-start gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-blue-200/50">
                <span className="text-white/18">{String(index + 1).padStart(2, "0")}</span>
                {label}
              </dt>
              <dd className="text-sm leading-7 text-white/58">{reflection[key]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
