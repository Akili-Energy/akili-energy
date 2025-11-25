"use client";

import { use } from "react";
import NewsArticleForm from "../../_components/news-article-form";

export default function EditNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return <NewsArticleForm mode="edit" originalSlug={slug} />;
}