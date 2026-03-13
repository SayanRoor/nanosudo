// Server component wrapper — exports generateMetadata, renders client UI
import type { ReactElement } from "react";
export { generateMetadata } from "./page-metadata";
import CasesPage from "./_client";

export default function CasesPageServer(): ReactElement {
  return <CasesPage />;
}
