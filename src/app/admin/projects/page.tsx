"use client";

import type { ReactElement } from "react";
import { FolderOpen } from "lucide-react";
import { CaseImageUploader } from "@/features/admin/components/case-image-uploader";

export default function AdminProjectsPage(): ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Кейсы</h1>
        <p className="text-sm text-muted-foreground mt-1">Управление портфолио и проектами</p>
      </div>
      <div className="glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-4">
        <FolderOpen className="w-10 h-10 text-muted-foreground opacity-40" />
        <p className="text-sm font-medium text-foreground">Полный редактор кейсов в разработке</p>
        <p className="text-xs text-muted-foreground max-w-sm">
          Сами кейсы пока редактируются в <code className="font-mono text-accent">src/lib/portfolio-data.ts</code> —
          но скриншоты для них теперь можно загружать ниже, без ручной работы с файлами.
        </p>
      </div>
      <CaseImageUploader />
    </div>
  );
}
