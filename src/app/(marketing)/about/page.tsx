"use client";

import { PageTransition } from "@/components/layout/page-transition";
import { useLanguage } from "@/hooks/use-language";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCounter } from "@/components/shared/stat-counter";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Music,
  Trophy,
  TrendingUp,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
} from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="container py-12 space-y-16">
        {/* Hero Section */}
        <FadeIn direction="up">
          <div className="space-y-4 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
              Benito Antonio Martínez Ocasio
            </h1>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
              Bad Bunny
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge variant="secondary">{t("Artista", "Artist")}</Badge>
              <Badge variant="secondary">{t("Productor", "Producer")}</Badge>
              <Badge variant="secondary">{t("Actor", "Actor")}</Badge>
              <Badge variant="secondary">{t("Activista", "Activist")}</Badge>
            </div>
          </div>
        </FadeIn>

        {/* Biography Section */}
        <FadeIn direction="up" delay={0.1}>
          <div className="space-y-8">
            <SectionHeader
              title="Biografía"
              titleEn="Biography"
              subtitle="El camino de un fenómeno global"
              subtitleEn="The path of a global phenomenon"
            />

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="space-y-6 text-muted-foreground">
                <p>
                  {t(
                    "Nacido el 10 de marzo de 1994 en Vega Baja, Puerto Rico, Benito Antonio Martínez Ocasio, conocido profesionalmente como Bad Bunny, emergió de las plataformas de streaming como SoundCloud para convertirse en uno de los artistas más influyentes de la música contemporánea. Su carrera despegó en 2016 cuando su sencillo \"Diles\" se volvió viral, capturando la atención de la industria musical global.",
                    "Born on March 10, 1994 in Vega Baja, Puerto Rico, Benito Antonio Martínez Ocasio, professionally known as Bad Bunny, emerged from streaming platforms like SoundCloud to become one of the most influential artists in contemporary music. His career took off in 2016 when his single \"Diles\" went viral, capturing the attention of the global music industry."
                  )}
                </p>

                <p>
                  {t(
                    "Tras firmar con Rimas Entertainment y posteriormente con Hear This Music, Bad Bunny revolucionó el trap latino y el reggaetón con su estilo único e inconfundible. Su habilidad para fusionar géneros y desafiar las normas establecidas lo convirtió en una fuerza imparable. Entre 2020 y 2022, logró el récord histórico de ser el artista más escuchado en Spotify durante tres años consecutivos, un logro sin precedentes que consolidó su estatus como fenómeno musical global.",
                    "After signing with Rimas Entertainment and later Hear This Music, Bad Bunny revolutionized Latin trap and reggaeton with his unique and unmistakable style. His ability to fuse genres and defy established norms made him an unstoppable force. Between 2020 and 2022, he achieved the historic record of being the most-streamed artist on Spotify for three consecutive years, an unprecedented achievement that cemented his status as a global musical phenomenon."
                  )}
                </p>

                <p>
                  {t(
                    "Su discografía incluye álbumes aclamados por la crítica como \"X 100PRE\" (2018), \"YHLQMDLG\" (2020), \"El Último Tour Del Mundo\" (2020), \"Un Verano Sin Ti\" (2022), \"nadie sabe lo que va a pasar mañana\" (2023), y \"Debí Tirar Más Fotos\" (2025). Cada lanzamiento ha redefinido las expectativas del género y ha expandido los límites de la música latina en el escenario mundial.",
                    "His discography includes critically acclaimed albums such as \"X 100PRE\" (2018), \"YHLQMDLG\" (2020), \"El Último Tour Del Mundo\" (2020), \"Un Verano Sin Ti\" (2022), \"nadie sabe lo que va a pasar mañana\" (2023), and \"Debí Tirar Más Fotos\" (2025). Each release has redefined genre expectations and expanded the boundaries of Latin music on the world stage."
                  )}
                </p>

                <p>
                  {t(
                    "Más allá de la música, Bad Bunny ha incursionado exitosamente en la actuación, con apariciones destacadas en películas como \"Bullet Train\" (2022) junto a Brad Pitt y \"Cassandro\" (2023). Su versatilidad también se extendió al mundo del wrestling profesional, con una memorable participación en WWE Royal Rumble 2021, demostrando su capacidad para trascender fronteras artísticas.",
                    "Beyond music, Bad Bunny has successfully ventured into acting, with notable appearances in films like \"Bullet Train\" (2022) alongside Brad Pitt and \"Cassandro\" (2023). His versatility also extended to professional wrestling, with a memorable appearance at WWE Royal Rumble 2021, demonstrating his ability to transcend artistic boundaries."
                  )}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Cultural Impact Section */}
        <FadeIn direction="up" delay={0.2}>
          <div className="space-y-8">
            <SectionHeader
              title="Impacto Cultural"
              titleEn="Cultural Impact"
              subtitle="Más que música: un movimiento global"
              subtitleEn="More than music: a global movement"
            />

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="space-y-6 text-muted-foreground">
                <p>
                  {t(
                    "Bad Bunny ha roto sistemáticamente las barreras del reggaetón tradicional, estableciéndose como pionero del trap latino y expandiendo las posibilidades del género. Su música trasciende el idioma, probando que el talento y la autenticidad no necesitan traducción para resonar globalmente.",
                    "Bad Bunny has systematically broken the barriers of traditional reggaeton, establishing himself as a pioneer of Latin trap and expanding the possibilities of the genre. His music transcends language, proving that talent and authenticity need no translation to resonate globally."
                  )}
                </p>

                <p>
                  {t(
                    "Como ícono de la moda, ha desafiado las normas de género y redefinido la masculinidad en la industria musical. Sus elecciones de vestuario audaces y su apertura sobre temas de identidad han inspirado a millones de fans a expresarse libremente, convirtiendo cada aparición pública en una declaración de autenticidad.",
                    "As a fashion icon, he has challenged gender norms and redefined masculinity in the music industry. His bold wardrobe choices and openness about identity issues have inspired millions of fans to express themselves freely, turning every public appearance into a statement of authenticity."
                  )}
                </p>

                <p>
                  {t(
                    "Su compromiso con Puerto Rico y su activismo político lo han posicionado como una voz crucial en movimientos sociales. Ha utilizado su plataforma para abogar por la independencia de Puerto Rico, denunciar la corrupción gubernamental y defender los derechos de las comunidades marginadas. Su influencia se extiende más allá de la música, convirtiéndolo en un líder cultural y agente de cambio social.",
                    "His commitment to Puerto Rico and his political activism have positioned him as a crucial voice in social movements. He has used his platform to advocate for Puerto Rico's independence, denounce government corruption, and defend the rights of marginalized communities. His influence extends beyond music, making him a cultural leader and agent of social change."
                  )}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Key Stats */}
        <FadeIn direction="up" delay={0.3}>
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-foreground text-center">
              {t("Logros destacados", "Key Achievements")}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y">
              <StatCounter value={6} label={t("Álbumes de estudio", "Studio Albums")} suffix="+" />
              <StatCounter value={3} label="Grammy Awards" />
              <StatCounter value={17} label="Latin Grammy Awards" suffix="+" />
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 text-4xl font-bold text-primary md:text-5xl lg:text-6xl">
                  <TrendingUp className="h-10 w-10 md:h-12 md:w-12" />
                  <span>#1</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                  {t("Artista más escuchado en Spotify (2020-2022)", "Most-streamed artist on Spotify (2020-2022)")}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Social & Streaming Links */}
        <FadeIn direction="up" delay={0.4}>
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-foreground text-center">
              {t("Síguelo y escúchalo", "Follow and Listen")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Social Media */}
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                asChild
              >
                <a
                  href="https://instagram.com/badbunnypr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="mr-2 h-5 w-5" />
                  Instagram
                  <ExternalLink className="ml-auto h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                asChild
              >
                <a
                  href="https://twitter.com/sanbenito"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="mr-2 h-5 w-5" />
                  Twitter
                  <ExternalLink className="ml-auto h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                asChild
              >
                <a
                  href="https://youtube.com/badbunny"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="mr-2 h-5 w-5" />
                  YouTube
                  <ExternalLink className="ml-auto h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                asChild
              >
                <a
                  href="https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Music className="mr-2 h-5 w-5" />
                  Spotify
                  <ExternalLink className="ml-auto h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* About this project */}
        <FadeIn direction="up" delay={0.5}>
          <div className="border-t pt-16">
            <div className="space-y-6 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground">
                {t("Sobre este proyecto", "About This Project")}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  "This is Bad Bunny es una plataforma interactiva que celebra la carrera y el impacto cultural de Bad Bunny. Este proyecto presenta una exploración visual e interactiva de su discografía, premios, entrevistas y momentos clave que han definido su trayectoria como artista global.",
                  "This is Bad Bunny is an interactive platform that celebrates Bad Bunny's career and cultural impact. This project presents a visual and interactive exploration of his discography, awards, interviews, and key moments that have defined his trajectory as a global artist."
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Construido con Next.js, React, TypeScript, Tailwind CSS, y Prisma.",
                  "Built with Next.js, React, TypeScript, Tailwind CSS, and Prisma."
                )}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
