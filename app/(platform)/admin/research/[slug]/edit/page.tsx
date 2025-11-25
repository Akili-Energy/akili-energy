"use client";

import { use } from "react";
import ResearchReportForm from "../../_components/research-report-form";

export default function EditNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return <ResearchReportForm mode="edit" originalSlug={slug} />;
}