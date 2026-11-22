import { IMAGE_FILE_FRAGMENT, LINK_REFERENCE_FRAGMENT } from "@/fragments";

export const HERO_FRAGMENT = /* groq */ `
  "fullName": autherInfo->fullName,
  hero {
    statusLabel,
    location,
    headline,
    headlineAccent,
    subline,
    primaryCta {
      label,
      type,
      url,
      openInNewTab,
      isDisabled,
      ${LINK_REFERENCE_FRAGMENT}
    },
    secondaryCta {
      label,
      type,
      url,
      openInNewTab,
      isDisabled,
      ${LINK_REFERENCE_FRAGMENT}
    },
    portrait {
      imageFile {
        ${IMAGE_FILE_FRAGMENT}
      },
      altText
    },
    nowBuilding { title, description, progress },
    facts[]{ label, value }
  }
`;
