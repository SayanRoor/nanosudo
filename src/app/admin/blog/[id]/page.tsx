"use client";

import type { ReactElement } from "react";
import { use } from "react";
import { BlogEditor } from "@/features/admin/components/blog-editor";

export default function AdminBlogEditPage({
  params,
}: {
  readonly params: Promise<{ readonly id: string }>;
}): ReactElement {
  const { id } = use(params);
  return <BlogEditor postId={id} />;
}
