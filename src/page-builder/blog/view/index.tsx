import { BlogListSection } from "@/sections/blogs/blog-list";
import { SectionBuilder } from "@/sections/section-builder";
import type { IBlogPageBuilderProps } from "./interface";

export function BlogPageBuilder({ page }: IBlogPageBuilderProps) {
  return (
    <main className="pt-8 pb-28">
      <BlogListSection
        eyebrow={page?.eyebrow}
        heading={page?.heading}
        headingAccent={page?.headingAccent}
        posts={page?.blogPosts ?? []}
      />
      {page?.sections && <SectionBuilder sections={page.sections} />}
    </main>
  );
}

export default BlogPageBuilder;
