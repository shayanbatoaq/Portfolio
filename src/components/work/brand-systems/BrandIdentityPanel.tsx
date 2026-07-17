import type { BrandSystemProject } from "@/data/brandSystems";

export function BrandIdentityPanel({ project }: { project: BrandSystemProject }) {
  const { identity } = project.sections;

  return (
    <section id="identity" aria-labelledby="identity-heading" className="scroll-mt-40 py-20 sm:py-28">
      <div className="mb-10 max-w-3xl">
        <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-purple-300/65">
          Visual language
        </p>
        <h2 id="identity-heading" className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          Identity
        </h2>
        <p className="mt-5 text-base leading-7 text-white/52">
          {identity.description}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-blue-300/60">
            Positioning system
          </p>
          <h3 className="mt-4 max-w-xl text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
            {identity.title}
          </h3>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {identity.items.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-3 border-t border-white/[0.07] pt-3 text-sm leading-6 text-white/55"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-blue-300 to-purple-400" aria-hidden="true" />
                <span>{item}</span>
                <span className="ml-auto text-[0.6rem] text-white/20" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="rounded-[1.6rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(59,130,246,0.055),rgba(139,92,246,0.025))] p-6 sm:p-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-purple-300/60">
            Visual direction
          </p>
          <div className="mt-6 grid gap-2.5">
            {project.visualDirection.map((direction, index) => (
              <div
                key={direction}
                className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/10 px-4 py-3.5"
              >
                <span className="text-sm text-white/62">{direction}</span>
                <span className="text-[0.62rem] uppercase tracking-[0.16em] text-white/24">
                  Direction {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-white/30">
            Directional descriptors are shown here; exact palette and type values can be added with final brand assets.
          </p>
        </aside>
      </div>
    </section>
  );
}
