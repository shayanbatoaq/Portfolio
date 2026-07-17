import Image from "next/image";
import type { BrandAsset } from "@/data/brandSystems";

type BrandAssetVisualProps = {
  asset: BrandAsset;
  sizes: string;
  priority?: boolean;
  compact?: boolean;
};

export function BrandAssetVisual({
  asset,
  sizes,
  priority = false,
  compact = false,
}: BrandAssetVisualProps) {
  const filename = asset.src.split("/").at(-1) ?? "brand-asset.webp";

  if (asset.available) {
    return (
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }

  return (
    <div
      className="brand-asset-placeholder absolute inset-0"
      role="img"
      aria-label={`${asset.alt}. Placeholder for ${filename}.`}
    >
      <span className="brand-asset-placeholder__index" aria-hidden="true">
        {asset.platform.slice(0, 2).toUpperCase()}
      </span>
      <span className="brand-asset-placeholder__frame" aria-hidden="true" />
      <span className="brand-asset-placeholder__copy">
        {!compact && <span>{asset.caption}</span>}
        <strong>{filename}</strong>
      </span>
    </div>
  );
}
