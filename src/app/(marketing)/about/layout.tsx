import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Bad Bunny | Benito Antonio Martínez Ocasio from Puerto Rico",
  description:
    "About Bad Bunny (Benito Antonio Martinez Ocasio): from Vega Baja, Puerto Rico to global icon. His activism, music, and cultural impact.",
  openGraph: {
    title: "Who Is Bad Bunny? | Biography & Puerto Rico Roots",
    description:
      "Learn about Bad Bunny (Benito Antonio Martinez Ocasio), from Vega Baja, Puerto Rico. His activism, Grammy-winning music, and cultural impact on Latin music.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
