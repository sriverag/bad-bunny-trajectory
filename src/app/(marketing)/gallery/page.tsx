import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { GalleryGrid } from "@/components/features/gallery-grid";
import { prisma } from "@/lib/prisma";

async function getGalleryItems() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { id: "desc" },
    });

    return items.map((item) => ({
      id: item.id,
      type: item.type as "PHOTO" | "VIDEO" | "ARTWORK",
      url: item.url,
      caption: item.caption,
      era: item.era,
      tags: item.tags,
    }));
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <PageTransition>
      <div className="container py-12 space-y-12">
        <SectionHeader
          title="Galería"
          titleEn="Gallery"
          subtitle="Fotos, videos y arte de la carrera de Bad Bunny"
          subtitleEn="Photos, videos, and artwork from Bad Bunny's career"
        />

        <GalleryGrid items={items} />
      </div>
    </PageTransition>
  );
}
