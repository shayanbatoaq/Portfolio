import { BRAND_SYSTEMS } from "@/data/brandSystems";
import { BrandSystemCard } from "./BrandSystemCard";

export function BrandSystemsSection() {
  return (
    <div className="brand-systems-section">
      <header className="brand-system-enter mb-10 max-w-3xl sm:mb-14">
        <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-blue-300/65">
          Connected growth systems
        </p>
        <h3 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
          Digital Growth
        </h3>
        <p className="mt-5 hidden max-w-2xl text-base leading-7 text-white/52 sm:block">
          Strategy becomes visible here: brand marks anchor distinctive feeds,
          campaign ideas turn into repeatable content, and every platform works
          as part of one recognizable digital presence.
        </p>
        <p className="mt-4 text-sm leading-6 text-white/52 sm:hidden">
          Brand identities brought to life through content, platforms, visuals,
          and campaigns.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        {BRAND_SYSTEMS.map((project, index) => (
          <div key={project.slug} className={index === 0 ? "lg:col-span-2" : ""}>
            <BrandSystemCard project={project} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
