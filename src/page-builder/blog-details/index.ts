export { getBlogPost } from "./data/loader";
export { SINGLE_BLOG_POST_QUERY } from "./data/query";
export { generateBlogDetailsMetadata } from "./metadata";
export { BlogDetailsView, default as BlogDetailsPage } from "./view";
export type {
  BlogDetailsData,
  IBlogDetailsProps,
  IBlogPostPageProps,
} from "./view/interface";
