// Server component wrapper — exports generateMetadata, renders client UI
import type { ReactElement } from "react";
export { generateMetadata } from "./page-metadata";
import { SupportPageClient } from "./_client";

export default function SupportPage(): ReactElement {
  return <SupportPageClient />;
}
