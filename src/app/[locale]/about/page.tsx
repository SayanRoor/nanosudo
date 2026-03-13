// Server component wrapper — exports generateMetadata, renders client UI
import type { ReactElement } from "react";
export { generateMetadata } from "./page-metadata";
import AboutPage from "./_client";

export default function AboutPageServer(): ReactElement {
  return <AboutPage />;
}
