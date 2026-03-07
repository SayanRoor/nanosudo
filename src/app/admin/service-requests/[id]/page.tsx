"use client";

import type { ReactElement } from "react";
import { use } from "react";
import { ServiceRequestDetail } from "@/features/admin/components/service-request-detail";

export default function AdminServiceRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): ReactElement {
  const { id } = use(params);
  return <ServiceRequestDetail id={id} />;
}
