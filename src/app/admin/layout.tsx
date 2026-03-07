// Admin route group layout — auth guard + sidebar via AdminLayout client component.

import type { ReactElement, ReactNode } from "react";
import { AdminLayout } from "@/features/admin/components/admin-layout";

export default function AdminRootLayout({ children }: { readonly children: ReactNode }): ReactElement {
  return <AdminLayout>{children}</AdminLayout>;
}
