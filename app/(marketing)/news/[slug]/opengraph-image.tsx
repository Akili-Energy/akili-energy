import { getContentBySlug } from "@/app/actions/content";
import { ImageResponse } from "next/og";
import { cache } from "react";

export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { slug: string } }) {
  const article = await cache(getContentBySlug)(params.slug, "news");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          alt={article?.title}
          src={article?.imageUrl}
          height="630"
          width="1200"
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
