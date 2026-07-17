import type { BrandCampaign } from "@/data/brandSystems";

export function CampaignWorkspace({ campaigns }: { campaigns: BrandCampaign[] }) {
  return (
    <section id="campaigns" aria-labelledby="campaigns-heading" className="scroll-mt-40 border-t border-white/[0.08] py-20 sm:py-28">
      <div className="mb-10 max-w-3xl">
        <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.23em] text-blue-300/65">
          Strategic campaign system
        </p>
        <h2 id="campaigns-heading" className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          Campaigns
        </h2>
        <p className="mt-5 text-base leading-7 text-white/52">
          Paid work is presented through objectives, audiences, language, and creative direction. Campaign metrics remain private and are not displayed.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {campaigns.map((campaign, index) => (
          <article
            key={campaign.title}
            className="relative overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-7"
          >
            <div className="absolute right-5 top-5 text-[0.65rem] font-medium tracking-[0.16em] text-white/20">
              {String(index + 1).padStart(2, "0")}
            </div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.19em] text-purple-300/60">
              {campaign.format}
            </p>
            <h3 className="mt-3 pr-10 text-2xl font-semibold tracking-[-0.035em] text-white">
              {campaign.title}
            </h3>

            <dl className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.17em] text-white/28">Objective</dt>
                <dd className="mt-2 text-sm leading-6 text-white/58">{campaign.objective}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.17em] text-white/28">Audience</dt>
                <dd className="mt-2 text-sm leading-6 text-white/58">{campaign.audience}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.17em] text-white/28">Platforms</dt>
                <dd className="mt-2 text-sm leading-6 text-white/58">{campaign.platforms.join(" · ")}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.17em] text-white/28">Languages</dt>
                <dd className="mt-2 text-sm leading-6 text-white/58">{campaign.languages.join(" · ")}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-white/[0.07] pt-5">
              <p className="text-[0.62rem] uppercase tracking-[0.17em] text-white/28">Creative direction</p>
              <p className="mt-2 text-sm leading-6 text-white/58">{campaign.creativeDirection}</p>
              <p className="mt-3 text-xs leading-5 text-white/36">{campaign.notes}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
