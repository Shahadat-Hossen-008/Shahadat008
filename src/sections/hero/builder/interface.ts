import type { PROFILE_QUERYResult } from "@/sanity/types";

export type ProfileResult = NonNullable<PROFILE_QUERYResult>;

export type HeroData = NonNullable<ProfileResult["hero"]>;

export interface ISanityHeroProps {
  hero?: ProfileResult["hero"] | null;
  /** Top-level author name from `autherInfo->fullName`, used as avatar initials fallback. */
  fullName?: ProfileResult["fullName"] | null;
}
