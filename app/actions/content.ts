"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/drizzle";
import { z } from "zod";
import {
  content,
  blogPosts,
  tags,
  contentTags,
  contentStatus,
  contentType,
  newsArticles,
} from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server"; // Assumes you have a server client utility
import type {
  ActionState,
  ContentCategory,
  ContentStatus,
  ContentType,
} from "@/lib/types";
import { and, desc, eq, lt, ne, sql } from "drizzle-orm";
import { BLOG_PAGE_SIZE } from "@/lib/constants";
import { headers } from "next/headers";

const BUCKET_NAME = "images";

export type ContentActionState = ActionState & {
  slug?: string;
  status?: ContentStatus;
};

/**
 * Calculates the estimated read time of a piece of content.
 * @param text The content string.
 * @returns A string like "5 min read".
 */
function calculateReadTime(text: string): string {
  const wordsPerMinute = 200;
  const noHtml = text.replace(/<[^>]*>/g, ""); // Strip HTML tags
  const wordCount = noHtml.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}

/**
 * Fetches a paginated, filterable list of published blog posts.
 */
export async function getContent({
  type,
  query,
  category,
  cursor,
  limit = BLOG_PAGE_SIZE,
  status = "published",
}: {
  type: ContentType;
  query?: string;
  category?: ContentCategory;
  cursor?: Date;
  limit?: number;
  status?: ContentStatus | null;
}) {
  const referer = (await headers()).get("referer");
  let isAdmin = status === null || status === undefined;
  if (referer) {
    const { pathname } = new URL(referer);
    isAdmin = pathname.startsWith("/admin");
  }

  const whereConditions = [eq(content.type, type)];
  if (!isAdmin) {
    whereConditions.push(eq(content.status, "published"));
  }

  if (query) {
    whereConditions.push(
      sql`to_tsvector('franglais', ${content.title} || ' ' || ${content.summary}) @@ plainto_tsquery('franglais', ${query})`
    );
  }

  if (category) {
    whereConditions.push(eq(content.category, category));
  }

  if (cursor) {
    whereConditions.push(lt(content.publicationDate, cursor));
  }

  try {
    const results = await db.query.content.findMany({
      where: and(...whereConditions),
      columns: {
        slug: true,
        title: true,
        summary: true,
        imageUrl: true,
        category: true,
        featured: true,
        publicationDate: true,
        status: isAdmin,
      },
      with: {
        author: {
          columns: {},
          with: {
            user: {
              columns: {
                name: true,
              }
            }
          }
        },
        blogPost:
          type === "blog"
            ? {
                columns: {
                  content: true,
                },
                //   extras: (blogPost, { sql }) => ({
                //     readTime: sql<number>`calculate_read_time(${blogPost.content})`
                //       .mapWith(Number)
                //       .as("read_time"),
                //   }),
              }
            : undefined,
        newsArticle:
          type === "news"
            ? {
                columns: {
                  content: true,
                },
                //   extras: (newsArticle, { sql }) => ({
                //     readTime: sql<number>`calculate_read_time(${newsArticle.content})`
                //       .mapWith(Number)
                //       .as("read_time"),
                //   }),
              }
            : undefined,
        tags: isAdmin
          ? {
              columns: {},
              with: {
                tag: true,
              },
            }
          : undefined,
      },
      orderBy: [desc(content.publicationDate)],
      limit: limit + 1,
    });

    const hasMore = results.length > limit;
    if (hasMore) results.pop();

    return {
      content: results.map(({tags, author: {user}, ...article}) => ({
        ...article,
        author: user,
        tags: isAdmin
          ? tags.map(({ tag: { name } }: any) => name).filter(Boolean)
          : undefined,
        readTime:
          isAdmin || type === "research"
            ? undefined
            : calculateReadTime(
                article[type === "blog" ? "blogPost" : "newsArticle"]
                  ?.content ?? ""
              ),
      })),
      hasMore,
    };
  } catch (error) {
    console.error(
      `Failed to fetch ${
        type === "blog"
          ? "Blog post"
          : type === "news"
          ? "News article"
          : "Research report"
      }: ${error}`
    );
    return { content: [], hasMore: false };
  }
}

/**
 * Fetches a single blog post by its slug, including related posts.
 */
export async function getContentBySlug(slug: string, type: ContentType) {
  try {
    const result = await db.query.content.findFirst({
      where: and(eq(content.slug, slug), eq(content.status, "published")),
      with: {
        author: {
          with: {
            user: {
              columns: {
                profilePictureUrl: true,
              }
            }
          }
        },
        blogPost:
          type === "blog"
            ? {
                columns: {
                  content: true,
                },
                //   extras: (blogPost, { sql }) => ({
                //     readTime: sql<number>`calculate_read_time(${blogPost.content})`
                //       .mapWith(Number)
                //       .as("read_time"),
                //   }),
              }
            : undefined,
        newsArticle:
          type === "news"
            ? {
                columns: {
                  content: true,
                },
                //   extras: (newsArticle, { sql }) => ({
                //     readTime: sql<number>`calculate_read_time(${newsArticle.content})`
                //       .mapWith(Number)
                //       .as("read_time"),
                //   }),
              }
            : undefined,
        tags: {
          columns: {},
          with: {
            tag: true,
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    const fullResult = {
      ...result,
      author: { ...result.author, photoUrl: result.author.user?.profilePictureUrl },
      readTime: calculateReadTime(
        result[type === "blog" ? "blogPost" : "newsArticle"]?.content ?? ""
      ),
      tags: result.tags.map(({ tag }) => tag),
    };

    const referer = (await headers()).get("referer");
    let isAdmin = false;
    if (referer) {
      const { pathname } = new URL(referer);
      isAdmin = pathname.startsWith("/admin");
    }
    if (isAdmin) {
      return fullResult;
    }

    // Fetch 3 related posts from the same category, excluding the current one
    const related = await db.query.content.findMany({
      where: and(
        eq(content.type, type),
        eq(content.status, "published"),
        eq(content.category, result.category),
        ne(content.slug, slug)
      ),
      limit: 2,
      orderBy: desc(content.publicationDate),
      with: {
        author: {
          columns: {},
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
        },
        blogPost:
          type === "blog"
            ? {
                columns: {
                  content: true,
                },
                //   extras: (blogPost, { sql }) => ({
                //     readTime: sql<number>`calculate_read_time(${blogPost.content})`
                //       .mapWith(Number)
                //       .as("read_time"),
                //   }),
              }
            : undefined,
        newsArticle:
          type === "news"
            ? {
                columns: {
                  content: true,
                },
                //   extras: (newsArticle, { sql }) => ({
                //     readTime: sql<number>`calculate_read_time(${newsArticle.content})`
                //       .mapWith(Number)
                //       .as("read_time"),
                //   }),
              }
            : undefined,
      },
    });

    const formattedRelated = related.map(({author: {user}, ...c}) => ({
      ...c,
      author: user,
      readTime: calculateReadTime(
        c[type === "blog" ? "blogPost" : "newsArticle"]?.content ?? ""
      ),
    }));

    return { ...fullResult, related: formattedRelated };
  } catch (error) {
    console.error(
      `Failed to fetch ${
        type === "blog"
          ? "blog post"
          : type === "news"
          ? "news article"
          : "research report"
      } by slug "${slug}":`,
      error
    );
    return null;
  }
}

// 1. Zod schema for robust server-side validation
const contentSchema = z.object({
  type: z.enum(contentType.enumValues),
  slug: z.string().min(3, "Slug is required").max(200),
  title: z.string().min(3, "Title must be at least 3 characters").max(72),
  summary: z.string().min(10, "Summary is required").max(500),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.preprocess((val) => {
    if (typeof val === "string" && val) return val.split(",");
    if (Array.isArray(val)) return val;
    return [];
  }, z.array(z.string()).max(10, "You can add up to 10 tags")),
  status: z.enum(contentStatus.enumValues),
  featuredImage: z.string().min(1, "Featured image is required"),
  isFeatured: z.preprocess((val) => val === "on" || val === true, z.boolean()),
  metaTitle: z.string().max(72).optional(),
  metaDescription: z.string().max(160).optional(),
});

export async function saveContent(
  prevState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  const supabase = await createClient();

  // 1. Authenticate the user and find their author profile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Authentication failed. Please log in." };
  }

  const author = await db.query.authors.findFirst({
    where: (authors, { eq }) => eq(authors.userId, user.id),
  });

  if (!author) {
    return {
      success: false,
      message: "Author profile not found for the current user.",
    };
  }

  // 2. Validate form data using Zod
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = contentSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  // Determine if this is an edit or create operation
  const originalSlug = formData.get("originalSlug") as string | undefined;
  let isEditMode = !!originalSlug;

  const referer = (await headers()).get("referer");
  if (referer) {
    const { pathname } = new URL(referer);
    isEditMode = pathname.endsWith("/edit");
  }

  let imageUrl = data.featuredImage;

  try {
    // 3. Handle image upload if it's a new image (data URL)
    if (imageUrl.startsWith("data:image")) {
      const mimeType = imageUrl.split(":")[1].split(";")[0];
      const buffer = Buffer.from(imageUrl.split(",")[1], "base64");
      const filePath = `content/blog/${data.slug}.${mimeType.split("/")[1]}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME) // Make sure this bucket exists in your Supabase project
        .upload(filePath, buffer, { contentType: mimeType, upsert: true });

      if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);

      imageUrl = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path).data.publicUrl;
    }

    // 4. Perform database operations within a transaction
    await db.transaction(async (tx) => {
      // Upsert the content. Using slug as the primary key.
      let contentTransaction: any = tx.insert(content).values({
        slug: data.slug,
        type: data.type,
        title: data.title,
        summary: data.summary,
        imageUrl,
        authorId: author.id,
        category: data.category as ContentCategory, // Cast because enum type is complex
        featured: data.isFeatured,
        status: data.status as ContentStatus,
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || data.summary,
        publicationDate: new Date(),
      });
      if (isEditMode) {
        contentTransaction = contentTransaction.onConflictDoUpdate({
          target: content.slug,
          set: {
            title: data.title,
            summary: data.summary,
            imageUrl,
            authorId: author.id,
            category: data.category as any,
            featured: data.isFeatured,
            status: data.status as ContentStatus,
            metaTitle: data.metaTitle || data.title,
            metaDescription: data.metaDescription || data.summary,
          },
        });
      }
      await contentTransaction;

      // Upsert the specific content
      switch (data.type) {
        case "blog":
          const blogData: typeof blogPosts.$inferInsert = {
            slug: data.slug,
            content: data.content,
          };
          if (isEditMode) {
            blogData.editorId = author.id;
            blogData.revisionDate = new Date();
          }
          let blogTransaction: any = tx.insert(blogPosts).values(blogData);
          if (isEditMode) {
            blogTransaction = blogTransaction.onConflictDoUpdate({
              target: blogPosts.slug,
              set: {
                content: data.content,
                editorId: author.id,
                revisionDate: new Date(), // Always update the revision date on edit
              },
            });
          }
          await blogTransaction;
          break;
        case "news":
          const newsData: typeof newsArticles.$inferInsert = {
            slug: data.slug,
            content: data.content,
          };
          // if (isEditMode) {
          //   blogData.editorId = author.id;
          //   blogData.revisionDate = new Date();
          // }
          let newsTransaction: any = tx.insert(newsArticles).values(newsData);
          if (isEditMode) {
            newsTransaction = newsTransaction.onConflictDoUpdate({
              target: newsArticles.slug,
              set: {
                content: data.content,
                // editorId: author.id,
                // revisionDate: new Date(), // Always update the revision date on edit
              },
            });
          }
          await newsTransaction;
          break;
        default:
          break;
      }

      // Handle tags
      if (data.tags.length > 0) {
        // Create tags that don't exist
        const tagValues = data.tags.map((tag) => ({
          id: tag.toLowerCase().replace(/\s+/g, "-"),
          name: tag,
        }));
        await tx.insert(tags).values(tagValues).onConflictDoNothing();

        // Clear existing tags for this post to handle edits correctly
        if (isEditMode) {
          await tx
            .delete(contentTags)
            .where(eq(contentTags.contentSlug, data.slug));
        }

        // Insert new tag relationships
        const contentTagValues = tagValues.map((tag) => ({
          contentSlug: data.slug,
          tagId: tag.id,
        }));
        await tx.insert(contentTags).values(contentTagValues);
      } else {
        // Ensure no tags are associated if the array is empty
        await tx
          .delete(contentTags)
          .where(eq(contentTags.contentSlug, data.slug));
      }
    });

    // 6. Revalidate paths to reflect new content
    revalidatePath(data.type === "blog" ? "/blog" : "/news-research"); // Revalidate the public content listing
    revalidatePath(`/${data.type}/${data.slug}`); // Revalidate the specific post page
    if (originalSlug) revalidatePath(`/${data.type}/${originalSlug}`);

    return {
      success: true,
      message: `${
        data.type === "blog"
          ? "Blog post"
          : data.type === "news"
          ? "News article"
          : "Research report"
      } "${data.title}" has been ${
        isEditMode ? "updated" : "created"
      } successfully.`,
      slug: data.slug,
      status: data.status,
    };
  } catch (error: any) {
    // 7. Handle any errors during the process
    console.error(
      `Failed to save ${
        data.type === "blog"
          ? "blog post"
          : data.type === "news"
          ? "news article"
          : "research report"
      }:`,
      error
    );
    return {
      success: false,
      message: `Error: ${error.message || "An unknown error occurred."}`,
    };
  }
}

export async function deleteContent(
  slug: string,
  type: ContentType
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();

  // Authenticate user and check permissions
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return { success: false, message: "Authentication failed." };
  }

  // Optional: Check if the user has an 'admin' or 'analyst_editor' role
  // This depends on your user role management setup
  // const userRole = ... ;
  // if (userRole !== 'admin' && userRole !== 'analyst_editor') {
  //   return { success: false, message: "Permission denied." };
  // }

  try {
    const deleted = await db
      .delete(content)
      .where(eq(content.slug, slug))
      .returning({ slug: content.slug });

    if (deleted.length === 0) {
      return {
        success: false,
        message: `${
          type === "blog"
            ? "Blog post"
            : type === "news"
            ? "News article"
            : "Research report"
        } not found.`,
      };
    }

    // Revalidate paths to ensure caches are cleared
    revalidatePath(type === "blog" ? "/blog" : "/news-research");
    revalidatePath(`/${type}/${slug}`);

    return {
      success: true,
      message: `Successfully deleted ${
        type === "blog"
          ? "blog post"
          : type === "news"
          ? "news article"
          : "research report"
      } "${deleted[0].slug}".`,
    };
  } catch (error: any) {
    console.error(
      `Failed to delete ${
        type === "blog"
          ? "blog post"
          : type === "news"
          ? "news article"
          : "research report"
      }:`,
      error
    );
    return { success: false, message: `Error: ${error.message}` };
  }
}
