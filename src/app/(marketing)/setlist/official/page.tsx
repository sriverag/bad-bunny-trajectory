import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { OfficialSetlist } from "@/components/halftime/official-setlist";

export const metadata: Metadata = {
  title: "Official Super Bowl LX Halftime Setlist — Bad Bunny",
  description:
    "The official 18-song setlist from Bad Bunny's Super Bowl LX Halftime Show, featuring Tego Calderon, Don Omar, Hector El Father, Daddy Yankee, Lady Gaga & Bruno Mars.",
  openGraph: {
    title: "Official Super Bowl LX Halftime Setlist",
    description:
      "18 songs from Bad Bunny's Super Bowl LX Halftime Show with surprise guests.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Super Bowl LX Halftime Setlist",
    description:
      "18 songs from Bad Bunny's Super Bowl LX Halftime Show with surprise guests.",
  },
};

export default function OfficialSetlistPage() {
  return (
    <PageTransition>
      <OfficialSetlist />
    </PageTransition>
  );
}
