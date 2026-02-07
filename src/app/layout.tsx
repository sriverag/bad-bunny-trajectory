import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Space_Grotesk,
  Inter,
  Oswald,
  Barlow_Condensed,
  Anton,
  Archivo,
  Baloo_2,
  Nunito,
  Playfair_Display,
  Source_Serif_4,
  Caveat,
  Karla,
  Montserrat,
  Work_Sans,
} from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "@/components/layout/language-provider";
import { ThemeBackgroundWrapper } from "@/components/animations/backgrounds";
import { DEFAULT_THEME, ThemeId } from "@/types/theme";
import type { Language } from "@/hooks/use-language";
import { SITE_NAME, SITE_DESCRIPTION, SITE_DESCRIPTION_EN, SITE_URL } from "@/lib/constants";
import { MusicArtistJsonLd, WebsiteJsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Theme display fonts
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["500", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "700", "900"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "700"],
});

// Theme body fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "500", "600"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "500", "600"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "700", "900"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Bad Bunny Grammy Winner & Super Bowl LX`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_EN,
  keywords: [
    "Bad Bunny",
    "Benito Antonio Martinez Ocasio",
    "Super Bowl LX",
    "Super Bowl halftime show 2026",
    "Grammy Album of the Year",
    "DeBí TiRAR MáS FOToS",
    "Puerto Rico",
    "reggaeton",
    "Latin music",
    "Bad Bunny discography",
    "Bad Bunny awards",
    "Bad Bunny tour 2026",
    "Bad Bunny concerts",
    "Bad Bunny interviews",
    "Un Verano Sin Ti",
    "YHLQMDLG",
    "musica urbana",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      en: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PR",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Bad Bunny: Grammy Album of the Year & Super Bowl LX Halftime Show",
    description: SITE_DESCRIPTION_EN,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bad Bunny - This is Bad Bunny",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bad Bunny: Grammy Winner & Super Bowl LX Headliner",
    description: SITE_DESCRIPTION_EN,
    creator: "@sanbenito",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("bb-theme");
  const theme = (themeCookie?.value as ThemeId) || DEFAULT_THEME;
  const langCookie = cookieStore.get("bb-lang");
  const language = (langCookie?.value as Language) || "es";

  return (
    <html lang={language} data-theme={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${inter.variable} ${oswald.variable} ${barlowCondensed.variable} ${anton.variable} ${archivo.variable} ${baloo2.variable} ${nunito.variable} ${playfairDisplay.variable} ${sourceSerif4.variable} ${caveat.variable} ${karla.variable} ${montserrat.variable} ${workSans.variable} antialiased`}
      >
        <MusicArtistJsonLd />
        <WebsiteJsonLd />
        <ThemeProvider defaultTheme={theme}>
          <LanguageProvider defaultLanguage={language}>
            <ThemeBackgroundWrapper />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
