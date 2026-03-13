// Server component wrapper — exports generateMetadata, renders client UI
import type { ReactElement } from "react";
export { generateMetadata } from "./page-metadata";
import ContactPage from "./_client";

export default function ContactPageServer(): ReactElement {
  return <ContactPage />;
}
