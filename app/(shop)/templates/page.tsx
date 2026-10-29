import type { Metadata } from "next";
import { TemplateCollection } from "./components/TemplateCollection";

export const metadata: Metadata = {
  title: "The collection",
  description:
    "Find a starting point for your next T-shirt. Customize every color, word, and detail in the Fabrico studio.",
};

export default function TemplatesPage() {
  return <TemplateCollection />;
}
