import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Props for the Sanity image renderer in `components/image`.
 *
 * Accepts any valid Sanity image source (raw schema object, dereferenced projection,
 * or asset reference) compatible with `urlFor`.
 */
export interface ISanityImageProps {
  image: SanityImageSource;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  className?: string;
  /**
   * Controls Sanity CDN sizing behavior:
   * - `"crop"` (default when both `width` and `height` are provided): crops to exact dimensions.
   * - `"max"`: preserves natural aspect ratio without cropping.
   */
  fit?: "crop" | "max";
  /**
   * Marks above-the-fold hero images for eager, high-priority loading (LCP).
   */
  priority?: boolean;
}
