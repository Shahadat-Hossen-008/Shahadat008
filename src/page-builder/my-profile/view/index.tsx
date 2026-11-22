import { HeroBuilder } from "@/sections/hero/builder";
import { SectionBuilder } from "@/sections/section-builder";
import type { IMyProfilePageBuilderProps } from "./interface";

export function MyProfilePageBuilder({
  profile,
  data,
}: IMyProfilePageBuilderProps) {
  const activeProfile = profile ?? data?.profile ?? null;

  return (
    <div className="bg-background">
      <HeroBuilder
        hero={activeProfile?.hero}
        fullName={activeProfile?.fullName}
      />
      <SectionBuilder sections={activeProfile?.sections} />
    </div>
  );
}

export default MyProfilePageBuilder;
