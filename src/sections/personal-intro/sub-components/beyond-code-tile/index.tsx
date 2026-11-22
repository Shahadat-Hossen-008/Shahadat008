import { Tile } from "../tile";
import type { IBeyondCodeTileProps } from "./interface";

export function BeyondCodeTile({ beyondCode, rise = 4 }: IBeyondCodeTileProps) {
  const eyebrow = beyondCode?.eyebrow?.trim() || "BEYOND CODE";
  const statement =
    beyondCode?.statement?.trim() ||
    "Photography, typography, and a deep appreciation for minimalistic architecture.";

  const rawInterests = (beyondCode?.interests ?? []).filter(
    (item): item is string => typeof item === "string" && Boolean(item.trim()),
  );

  const defaultInterests = ["Photography", "Typography", "Architecture"];
  const interests = rawInterests.length ? rawInterests : defaultInterests;

  return (
    <Tile
      tone="light"
      labelledBy="personal-intro-beyond-title"
      className="md:col-span-1 bento:col-span-4 flex flex-col justify-between gap-5"
      rise={rise}
    >
      <div className="flex flex-col gap-3">
        <p className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-muted-forest">
          {eyebrow}
        </p>
        <p
          id="personal-intro-beyond-title"
          className="font-sans text-sm sm:text-[15px] font-medium leading-relaxed text-forest"
        >
          {statement}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1 font-sans text-xs font-medium text-forest">
        {interests.map((interest) => (
          <span
            key={interest}
            className="inline-flex items-center rounded-full border border-limestone-border/40 bg-background/70 px-3 py-1"
          >
            {interest}
          </span>
        ))}
      </div>
    </Tile>
  );
}

export default BeyondCodeTile;
