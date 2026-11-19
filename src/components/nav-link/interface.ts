import type { ReactNode } from "react";
import type { ResolvedNavLink } from "@/lib/sanity/links";

export interface INavLinkItemProps {
  link: ResolvedNavLink;
  className?: string;
  children?: ReactNode;
  /** Marks the link as the active route (`aria-current="page"`). */
  isActive?: boolean;
  /** Called on activation — used to close the mobile menu after navigation. */
  onNavigate?: () => void;
}
