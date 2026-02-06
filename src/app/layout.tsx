import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "@/components/layout/language-provider";
import { ThemeBackgroundWrapper } from "@/components/animations/backgrounds";
import { DEFAULT_THEME, ThemeId } from "@/types/theme";
import type { Language } from "@/hooks/use-language";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
