'use client';

// DocumentViewer — opens a scanned document (diploma) in a full-screen lightbox.
// Shows a WebP render of the scan so it works on every device (mobile browsers
// do not render PDFs inline, and the site CSP blocks PDF iframes), plus links
// to open or download the original PDF.
import type { ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Download, ExternalLink, FileText, X } from "lucide-react";

type DocumentViewerProps = {
  readonly title: string;
  /** Original PDF, offered for opening/downloading */
  readonly pdfUrl: string;
  /** Raster render of the PDF shown in the lightbox */
  readonly imageUrl: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
};

/** Close on Escape, lock page scroll and move focus into the dialog while open. */
function useDialogBehaviour(open: boolean, close: () => void): React.RefObject<HTMLButtonElement | null> {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect((): (() => void) | undefined => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return (): void => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return closeRef;
}

const ACTION_CLASS =
  "inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent";

export function DocumentViewer({ title, pdfUrl, imageUrl, imageWidth, imageHeight }: DocumentViewerProps): ReactElement {
  const t = useTranslations("about.pdf");
  const [open, setOpen] = useState(false);
  const close = useCallback((): void => setOpen(false), []);
  const closeRef = useDialogBehaviour(open, close);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
      >
        <FileText className="h-4 w-4" aria-hidden="true" />
        {t("view")}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 p-3 backdrop-blur-sm md:p-6"
          onClick={close}
        >
          <div
            className="glass-card flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border/60 p-3 md:p-4">
              <h3 className="font-heading text-sm md:text-lg">{title}</h3>
              <button ref={closeRef} type="button" onClick={close} className="rounded-lg p-2 transition-colors hover:bg-surface" aria-label={t("close")}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-surface/40 p-2 md:p-4">
              <Image src={imageUrl} alt={title} width={imageWidth} height={imageHeight} sizes="(max-width: 1024px) 100vw, 1000px" className="mx-auto h-auto max-h-[calc(100dvh-14rem)] w-auto max-w-full rounded-lg" priority />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 p-3 md:p-4">
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={ACTION_CLASS}>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {t("openPdf")}
              </a>
              <a href={pdfUrl} download className={ACTION_CLASS}>
                <Download className="h-4 w-4" aria-hidden="true" />
                {t("download")}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
