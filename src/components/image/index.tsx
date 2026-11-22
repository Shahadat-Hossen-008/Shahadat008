import { urlFor } from "@/sanity/lib/image";
import type { ISanityImageProps } from "./interface";

/**
 * How Sanity builds the `src` URL
 * 1. `urlFor(image)` — calls `builder.image(source)` from `@sanity/image-url`.
 *    The builder is initialised with the project's `projectId` and `dataset`,
 *    so it knows which Sanity CDN origin to target:
 *    `https://cdn.sanity.io/images/{projectId}/{dataset}/{assetId}`
 *
 * 2. `.auto("format")` — lets the Sanity Image API pick the best format
 *    (WebP, AVIF, etc.) based on the `Accept` header sent by the browser.
 *
 * 3. `.quality(n)` — appends `?q=n` to control lossy compression (0-100).
 *
 * 4. `.width(w).height(h)` — appends `?w=…&h=…` so the CDN returns a
 *    resized image rather than the original full-resolution asset.
 *
 * 5. `.url()` — serialises all of the above into the final URL string that
 *    is used as `srcSet` / `src`.
 */
export function SanityImage({
  image,
  alt,
  width,
  height,
  className,
  fit,
  priority = false,
}: ISanityImageProps) {
  if (!image || !width) return null;

  const preserveAspect = fit === "max" || !height;

  const buildUrl = (quality: number) => {
    const base = urlFor(image).auto("format").quality(quality).width(width);
    return preserveAspect
      ? base.fit("max").url()
      : base.height(height).url();
  };

  return (
    <picture>
      <source
        srcSet={buildUrl(75)}
        type="image/webp" /**only tells the browser what the resource *is**/
      />
      <img
        src={buildUrl(80)}
        alt={alt ?? ""}
        width={width}
        height={preserveAspect ? undefined : height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}

export default SanityImage;
