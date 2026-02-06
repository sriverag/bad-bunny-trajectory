import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL ?? `file:${path.resolve(__dirname, "..", "dev.db")}`;
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

export async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.apiCache.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.concert.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.award.deleteMany();
  await prisma.track.deleteMany();
  await prisma.album.deleteMany();

  // ============================================================
  // ALBUMS & TRACKS
  // ============================================================

  // --- X 100PRE (2018) ---
  const x100pre = await prisma.album.create({
    data: {
      slug: "x100pre",
      title: "X 100PRE",
      year: 2018,
      themeId: "x100pre",
      spotifyId: "7CjJb2mikwAWA1V6kewFBF",
      appleMusicId: "1447554595",
      coverUrl: "/images/albums/x100pre.jpg",
      description:
        "El primer álbum de estudio de Bad Bunny, X 100PRE, mezcla reggaetón, trap latino, rock y pop. Marcó su consolidación como superestrella global.",
      descriptionEn:
        "Bad Bunny's debut studio album, X 100PRE, blends reggaeton, Latin trap, rock, and pop. It marked his consolidation as a global superstar.",
      tracks: {
        create: [
          { title: "NI BIEN NI MAL", trackNumber: 1, durationMs: 218000, danceability: 0.74, energy: 0.68, valence: 0.42, tempo: 92.0, acousticness: 0.12 },
          { title: "Si Estuviésemos Juntos", trackNumber: 2, durationMs: 259000, danceability: 0.62, energy: 0.55, valence: 0.35, tempo: 85.0, acousticness: 0.28 },
          { title: "Solo de Mí", trackNumber: 3, durationMs: 234000, danceability: 0.68, energy: 0.72, valence: 0.48, tempo: 97.0, acousticness: 0.08 },
          { title: "Otra Noche en Miami", trackNumber: 4, durationMs: 267000, danceability: 0.76, energy: 0.71, valence: 0.55, tempo: 100.0, acousticness: 0.05 },
          { title: "La Romana", trackNumber: 5, durationMs: 230000, featuring: "El Alfa", danceability: 0.82, energy: 0.80, valence: 0.72, tempo: 112.0, acousticness: 0.04 },
          { title: "200 MPH", trackNumber: 6, durationMs: 215000, featuring: "Diplo", danceability: 0.70, energy: 0.78, valence: 0.50, tempo: 130.0, acousticness: 0.03 },
          { title: "Caro", trackNumber: 7, durationMs: 246000, danceability: 0.79, energy: 0.65, valence: 0.60, tempo: 96.0, acousticness: 0.10 },
          { title: "Tenemos Que Hablar", trackNumber: 8, durationMs: 193000, danceability: 0.58, energy: 0.50, valence: 0.30, tempo: 78.0, acousticness: 0.35 },
          { title: "MIA", trackNumber: 9, durationMs: 215000, featuring: "Drake", danceability: 0.80, energy: 0.63, valence: 0.52, tempo: 97.0, acousticness: 0.11 },
          { title: "RLNDT", trackNumber: 10, durationMs: 227000, danceability: 0.72, energy: 0.69, valence: 0.45, tempo: 88.0, acousticness: 0.14 },
          { title: "Desde El Corazón", trackNumber: 11, durationMs: 248000, danceability: 0.60, energy: 0.48, valence: 0.25, tempo: 76.0, acousticness: 0.40 },
          { title: "Estamos Bien", trackNumber: 12, durationMs: 225000, danceability: 0.81, energy: 0.76, valence: 0.68, tempo: 93.0, acousticness: 0.06 },
          { title: "Cuando Perriaba", trackNumber: 13, durationMs: 242000, featuring: "Nesi", danceability: 0.77, energy: 0.70, valence: 0.55, tempo: 105.0, acousticness: 0.07 },
          { title: "Como Antes", trackNumber: 14, durationMs: 196000, danceability: 0.71, energy: 0.66, valence: 0.40, tempo: 90.0, acousticness: 0.15 },
          { title: "Ser Bichote", trackNumber: 15, durationMs: 220000, danceability: 0.75, energy: 0.74, valence: 0.58, tempo: 94.0, acousticness: 0.09 },
        ],
      },
    },
  });

  // --- YHLQMDLG (2020) ---
  const yhlqmdlg = await prisma.album.create({
    data: {
      slug: "yhlqmdlg",
      title: "YHLQMDLG",
      year: 2020,
      themeId: "yhlqmdlg",
      spotifyId: "5lJqux7orBlA1QzyiBGti1",
      appleMusicId: "1500776322",
      coverUrl: "/images/albums/yhlqmdlg.jpg",
      description:
        "YHLQMDLG (Yo Hago Lo Que Me Da La Gana) es el segundo álbum de estudio de Bad Bunny. El disco explora desde reggaetón clásico hasta cumbia y dembow.",
      descriptionEn:
        "YHLQMDLG (I Do Whatever I Want) is Bad Bunny's second studio album. The record explores everything from classic reggaeton to cumbia and dembow.",
      tracks: {
        create: [
          { title: "Si Veo a Tu Mamá", trackNumber: 1, durationMs: 193000, danceability: 0.73, energy: 0.62, valence: 0.65, tempo: 95.0, acousticness: 0.18 },
          { title: "La Difícil", trackNumber: 2, durationMs: 163000, danceability: 0.80, energy: 0.72, valence: 0.68, tempo: 98.0, acousticness: 0.05 },
          { title: "Pero Ya No", trackNumber: 3, durationMs: 197000, danceability: 0.65, energy: 0.55, valence: 0.35, tempo: 82.0, acousticness: 0.30 },
          { title: "La Santa", trackNumber: 4, durationMs: 200000, featuring: "Daddy Yankee", danceability: 0.82, energy: 0.78, valence: 0.72, tempo: 94.0, acousticness: 0.04 },
          { title: "Yo Perreo Sola", trackNumber: 5, durationMs: 172000, danceability: 0.88, energy: 0.81, valence: 0.76, tempo: 103.0, acousticness: 0.03 },
          { title: "Bichiyal", trackNumber: 6, durationMs: 196000, featuring: "Yaviah", danceability: 0.79, energy: 0.74, valence: 0.62, tempo: 92.0, acousticness: 0.08 },
          { title: "Soliá", trackNumber: 7, durationMs: 169000, danceability: 0.71, energy: 0.60, valence: 0.55, tempo: 86.0, acousticness: 0.22 },
          { title: "La Zona", trackNumber: 8, durationMs: 249000, featuring: "Nicky Jam & Ozuna", danceability: 0.78, energy: 0.70, valence: 0.58, tempo: 90.0, acousticness: 0.10 },
          { title: "Safaera", trackNumber: 9, durationMs: 296000, featuring: "Jowell & Randy, Ñengo Flow", danceability: 0.85, energy: 0.88, valence: 0.80, tempo: 110.0, acousticness: 0.02 },
          { title: "25/8", trackNumber: 10, durationMs: 212000, danceability: 0.70, energy: 0.65, valence: 0.45, tempo: 88.0, acousticness: 0.15 },
          { title: "Puesto Pa' Guerrear", trackNumber: 11, durationMs: 194000, featuring: "Myke Towers", danceability: 0.76, energy: 0.73, valence: 0.60, tempo: 96.0, acousticness: 0.07 },
          { title: "Ignorantes", trackNumber: 12, durationMs: 206000, featuring: "Sech", danceability: 0.74, energy: 0.61, valence: 0.50, tempo: 88.0, acousticness: 0.12 },
          { title: "A Tu Merced", trackNumber: 13, durationMs: 218000, danceability: 0.66, energy: 0.52, valence: 0.38, tempo: 80.0, acousticness: 0.25 },
          { title: "Una Vez", trackNumber: 14, durationMs: 277000, featuring: "Mora", danceability: 0.68, energy: 0.58, valence: 0.42, tempo: 84.0, acousticness: 0.20 },
          { title: "Hablamos Mañana", trackNumber: 15, durationMs: 245000, featuring: "Duki & Pablo Chill-E", danceability: 0.72, energy: 0.66, valence: 0.52, tempo: 92.0, acousticness: 0.09 },
          { title: "Está Cabrón Ser Yo", trackNumber: 16, durationMs: 190000, featuring: "Anuel AA", danceability: 0.77, energy: 0.75, valence: 0.65, tempo: 100.0, acousticness: 0.05 },
          { title: "Vete", trackNumber: 17, durationMs: 198000, danceability: 0.80, energy: 0.70, valence: 0.48, tempo: 95.0, acousticness: 0.10 },
          { title: "<3", trackNumber: 18, durationMs: 180000, danceability: 0.60, energy: 0.45, valence: 0.30, tempo: 75.0, acousticness: 0.35 },
          { title: "P FKN R", trackNumber: 19, durationMs: 199000, featuring: "Kendo Kaponi & Arcángel", danceability: 0.75, energy: 0.80, valence: 0.55, tempo: 98.0, acousticness: 0.04 },
          { title: "RD", trackNumber: 20, durationMs: 200000, danceability: 0.69, energy: 0.58, valence: 0.40, tempo: 85.0, acousticness: 0.18 },
        ],
      },
    },
  });

  // --- El Último Tour Del Mundo (2020) ---
  const ultimoTour = await prisma.album.create({
    data: {
      slug: "el-ultimo-tour-del-mundo",
      title: "El Último Tour Del Mundo",
      year: 2020,
      themeId: "ultimo-tour",
      spotifyId: "2d9BCZeAAhiZWPpbX9aPCW",
      appleMusicId: "1542102907",
      coverUrl: "/images/albums/el-ultimo-tour-del-mundo.jpg",
      description:
        "El Último Tour Del Mundo es el tercer álbum de Bad Bunny, con influencias de rock alternativo, punk y emo. Fue el primer álbum completamente en español en llegar al #1 del Billboard 200.",
      descriptionEn:
        "El Último Tour Del Mundo is Bad Bunny's third album, with alternative rock, punk, and emo influences. It was the first all-Spanish album to reach #1 on the Billboard 200.",
      tracks: {
        create: [
          { title: "EL MUNDO ES MÍO", trackNumber: 1, durationMs: 181000, danceability: 0.55, energy: 0.82, valence: 0.35, tempo: 140.0, acousticness: 0.02 },
          { title: "TE MUDASTE", trackNumber: 2, durationMs: 165000, danceability: 0.60, energy: 0.78, valence: 0.30, tempo: 135.0, acousticness: 0.03 },
          { title: "HOY COBRÉ", trackNumber: 3, durationMs: 193000, featuring: "Jhay Cortez", danceability: 0.72, energy: 0.68, valence: 0.55, tempo: 95.0, acousticness: 0.08 },
          { title: "MALDITA POBREZA", trackNumber: 4, durationMs: 222000, danceability: 0.58, energy: 0.65, valence: 0.28, tempo: 88.0, acousticness: 0.15 },
          { title: "120", trackNumber: 5, durationMs: 202000, danceability: 0.68, energy: 0.75, valence: 0.45, tempo: 120.0, acousticness: 0.05 },
          { title: "ANTES QUE SE ACABE", trackNumber: 6, durationMs: 214000, danceability: 0.62, energy: 0.70, valence: 0.38, tempo: 110.0, acousticness: 0.10 },
          { title: "TRELLAS", trackNumber: 7, durationMs: 226000, danceability: 0.50, energy: 0.58, valence: 0.22, tempo: 78.0, acousticness: 0.30 },
          { title: "SORRY PAPI", trackNumber: 8, durationMs: 175000, danceability: 0.65, energy: 0.72, valence: 0.40, tempo: 100.0, acousticness: 0.06 },
          { title: "HACIENDO QUE ME AMAS", trackNumber: 9, durationMs: 188000, danceability: 0.55, energy: 0.60, valence: 0.25, tempo: 85.0, acousticness: 0.20 },
          { title: "YO VISTO ASÍ", trackNumber: 10, durationMs: 160000, featuring: "ABRA", danceability: 0.70, energy: 0.76, valence: 0.50, tempo: 105.0, acousticness: 0.04 },
          { title: "LA DROGA", trackNumber: 11, durationMs: 220000, danceability: 0.63, energy: 0.67, valence: 0.35, tempo: 92.0, acousticness: 0.12 },
          { title: "DÁKITI", trackNumber: 12, durationMs: 205000, featuring: "Jhay Cortez", danceability: 0.84, energy: 0.62, valence: 0.72, tempo: 110.0, acousticness: 0.08 },
          { title: "LA NOCHE DE ANOCHE", trackNumber: 13, durationMs: 225000, featuring: "ROSALÍA", danceability: 0.60, energy: 0.50, valence: 0.30, tempo: 80.0, acousticness: 0.28 },
          { title: "TE DESEO LO MEJOR", trackNumber: 14, durationMs: 196000, danceability: 0.52, energy: 0.55, valence: 0.20, tempo: 75.0, acousticness: 0.35 },
          { title: "BOOKER T", trackNumber: 15, durationMs: 162000, danceability: 0.75, energy: 0.80, valence: 0.60, tempo: 125.0, acousticness: 0.03 },
          { title: "CANTARES DE NAVIDAD", trackNumber: 16, durationMs: 168000, danceability: 0.58, energy: 0.52, valence: 0.48, tempo: 82.0, acousticness: 0.22 },
        ],
      },
    },
  });

  // --- Un Verano Sin Ti (2022) ---
  const verano = await prisma.album.create({
    data: {
      slug: "un-verano-sin-ti",
      title: "Un Verano Sin Ti",
      year: 2022,
      themeId: "verano",
      spotifyId: "3RQQmkQEvNCY4prGKE6oc5",
      appleMusicId: "1622045624",
      coverUrl: "/images/albums/un-verano-sin-ti.jpg",
      description:
        "Un Verano Sin Ti es el cuarto álbum de estudio de Bad Bunny. Inspirado en la playa y el verano, fusiona reggaetón, dembow, mambo y indie pop. Fue el álbum más escuchado en Spotify en 2022.",
      descriptionEn:
        "Un Verano Sin Ti is Bad Bunny's fourth studio album. Inspired by the beach and summer, it fuses reggaeton, dembow, mambo, and indie pop. It was the most-streamed album on Spotify in 2022.",
      tracks: {
        create: [
          { title: "Moscow Mule", trackNumber: 1, durationMs: 245000, danceability: 0.78, energy: 0.60, valence: 0.58, tempo: 100.0, acousticness: 0.15 },
          { title: "Después de la Playa", trackNumber: 2, durationMs: 228000, danceability: 0.80, energy: 0.68, valence: 0.65, tempo: 98.0, acousticness: 0.10 },
          { title: "Me Porto Bonito", trackNumber: 3, durationMs: 178000, featuring: "Chencho Corleone", danceability: 0.90, energy: 0.72, valence: 0.80, tempo: 92.0, acousticness: 0.05 },
          { title: "Tití Me Preguntó", trackNumber: 4, durationMs: 245000, danceability: 0.86, energy: 0.78, valence: 0.75, tempo: 105.0, acousticness: 0.03 },
          { title: "Un Ratito", trackNumber: 5, durationMs: 244000, danceability: 0.82, energy: 0.70, valence: 0.62, tempo: 96.0, acousticness: 0.08 },
          { title: "Yo No Soy Celoso", trackNumber: 6, durationMs: 188000, danceability: 0.72, energy: 0.55, valence: 0.50, tempo: 85.0, acousticness: 0.22 },
          { title: "Tarot", trackNumber: 7, durationMs: 227000, featuring: "Jhay Cortez", danceability: 0.70, energy: 0.58, valence: 0.45, tempo: 88.0, acousticness: 0.18 },
          { title: "Neverita", trackNumber: 8, durationMs: 212000, danceability: 0.85, energy: 0.72, valence: 0.70, tempo: 108.0, acousticness: 0.06 },
          { title: "La Corriente", trackNumber: 9, durationMs: 234000, featuring: "Tony Dize", danceability: 0.76, energy: 0.62, valence: 0.55, tempo: 92.0, acousticness: 0.14 },
          { title: "Efecto", trackNumber: 10, durationMs: 221000, danceability: 0.83, energy: 0.75, valence: 0.68, tempo: 100.0, acousticness: 0.05 },
          { title: "Party", trackNumber: 11, durationMs: 198000, featuring: "Rauw Alejandro", danceability: 0.88, energy: 0.80, valence: 0.78, tempo: 115.0, acousticness: 0.03 },
          { title: "Aguacero", trackNumber: 12, durationMs: 210000, danceability: 0.74, energy: 0.65, valence: 0.52, tempo: 90.0, acousticness: 0.12 },
          { title: "Ensename a Bailar", trackNumber: 13, durationMs: 193000, danceability: 0.81, energy: 0.68, valence: 0.60, tempo: 95.0, acousticness: 0.10 },
          { title: "Ojitos Lindos", trackNumber: 14, durationMs: 257000, featuring: "Bomba Estéreo", danceability: 0.65, energy: 0.52, valence: 0.40, tempo: 82.0, acousticness: 0.28 },
          { title: "Dos Mil 16", trackNumber: 15, durationMs: 225000, danceability: 0.68, energy: 0.58, valence: 0.42, tempo: 86.0, acousticness: 0.20 },
          { title: "El Apagón", trackNumber: 16, durationMs: 209000, danceability: 0.87, energy: 0.82, valence: 0.72, tempo: 118.0, acousticness: 0.02 },
          { title: "Otro Atardecer", trackNumber: 17, durationMs: 239000, featuring: "The Marías", danceability: 0.60, energy: 0.48, valence: 0.35, tempo: 78.0, acousticness: 0.32 },
          { title: "Un Coco", trackNumber: 18, durationMs: 245000, danceability: 0.70, energy: 0.60, valence: 0.48, tempo: 88.0, acousticness: 0.15 },
          { title: "Andrea", trackNumber: 19, durationMs: 210000, danceability: 0.72, energy: 0.62, valence: 0.52, tempo: 92.0, acousticness: 0.12 },
          { title: "Me Fui de Vacaciones", trackNumber: 20, durationMs: 195000, danceability: 0.78, energy: 0.70, valence: 0.60, tempo: 98.0, acousticness: 0.08 },
          { title: "Un Verano Sin Ti", trackNumber: 21, durationMs: 232000, danceability: 0.55, energy: 0.42, valence: 0.28, tempo: 72.0, acousticness: 0.40 },
          { title: "Callaíta", trackNumber: 22, durationMs: 252000, danceability: 0.84, energy: 0.65, valence: 0.70, tempo: 94.0, acousticness: 0.10 },
          { title: "Agosto", trackNumber: 23, durationMs: 201000, danceability: 0.62, energy: 0.50, valence: 0.32, tempo: 80.0, acousticness: 0.25 },
        ],
      },
    },
  });

  // --- Nadie Sabe Lo Que Va a Pasar Mañana (2023) ---
  const nadieSabe = await prisma.album.create({
    data: {
      slug: "nadie-sabe",
      title: "Nadie Sabe Lo Que Va a Pasar Mañana",
      year: 2023,
      themeId: "nadie-sabe",
      spotifyId: "4FftCsAcXXD1nFO9RFUNFO",
      appleMusicId: "1710982865",
      coverUrl: "/images/albums/nadie-sabe.jpg",
      description:
        "Nadie Sabe Lo Que Va a Pasar Mañana es el quinto álbum de Bad Bunny. Incluye colaboraciones con artistas como Feid, Luar La L y eladio carrión, explorando sonidos más oscuros y experimentales.",
      descriptionEn:
        "Nadie Sabe Lo Que Va a Pasar Mañana is Bad Bunny's fifth album. It features collaborations with artists like Feid, Luar La L, and eladio carrión, exploring darker and more experimental sounds.",
      tracks: {
        create: [
          { title: "NADIE SABE", trackNumber: 1, durationMs: 164000, danceability: 0.65, energy: 0.70, valence: 0.40, tempo: 95.0, acousticness: 0.10 },
          { title: "UN PREVIEW", trackNumber: 2, durationMs: 247000, danceability: 0.78, energy: 0.72, valence: 0.58, tempo: 100.0, acousticness: 0.06 },
          { title: "MONACO", trackNumber: 3, durationMs: 220000, danceability: 0.82, energy: 0.76, valence: 0.65, tempo: 105.0, acousticness: 0.04 },
          { title: "THUNDER Y LIGHTNING", trackNumber: 4, durationMs: 234000, featuring: "eladio carrión", danceability: 0.75, energy: 0.80, valence: 0.55, tempo: 112.0, acousticness: 0.03 },
          { title: "WHERE SHE GOES", trackNumber: 5, durationMs: 186000, danceability: 0.85, energy: 0.78, valence: 0.70, tempo: 128.0, acousticness: 0.02 },
          { title: "FINA", trackNumber: 6, durationMs: 205000, featuring: "Feid", danceability: 0.80, energy: 0.74, valence: 0.62, tempo: 98.0, acousticness: 0.08 },
          { title: "LOS PITS", trackNumber: 7, durationMs: 172000, danceability: 0.72, energy: 0.68, valence: 0.48, tempo: 92.0, acousticness: 0.12 },
          { title: "EL CLúB", trackNumber: 8, durationMs: 190000, danceability: 0.88, energy: 0.82, valence: 0.72, tempo: 120.0, acousticness: 0.02 },
          { title: "CYBERTRUCK", trackNumber: 9, durationMs: 198000, danceability: 0.76, energy: 0.78, valence: 0.55, tempo: 108.0, acousticness: 0.05 },
          { title: "PERRO NEGRO", trackNumber: 10, durationMs: 231000, featuring: "Feid", danceability: 0.83, energy: 0.80, valence: 0.68, tempo: 102.0, acousticness: 0.03 },
          { title: "NO ME QUIERO CASAR", trackNumber: 11, durationMs: 178000, danceability: 0.68, energy: 0.60, valence: 0.42, tempo: 88.0, acousticness: 0.18 },
          { title: "HIBIKI", trackNumber: 12, durationMs: 215000, danceability: 0.70, energy: 0.65, valence: 0.45, tempo: 90.0, acousticness: 0.14 },
          { title: "GRACIAS POR NADA", trackNumber: 13, durationMs: 182000, danceability: 0.62, energy: 0.58, valence: 0.32, tempo: 82.0, acousticness: 0.22 },
          { title: "ACHO PR", trackNumber: 14, durationMs: 244000, danceability: 0.74, energy: 0.72, valence: 0.55, tempo: 96.0, acousticness: 0.08 },
          { title: "TELEFONO NUEVO", trackNumber: 15, durationMs: 167000, featuring: "Luar La L", danceability: 0.80, energy: 0.76, valence: 0.60, tempo: 100.0, acousticness: 0.05 },
          { title: "VUELVE CANDY B", trackNumber: 16, durationMs: 253000, danceability: 0.66, energy: 0.55, valence: 0.38, tempo: 84.0, acousticness: 0.20 },
          { title: "CASA SOLA", trackNumber: 17, durationMs: 195000, danceability: 0.78, energy: 0.72, valence: 0.58, tempo: 98.0, acousticness: 0.06 },
          { title: "MERCEDES CAROTA", trackNumber: 18, durationMs: 170000, danceability: 0.72, energy: 0.68, valence: 0.50, tempo: 95.0, acousticness: 0.10 },
          { title: "EUROPA", trackNumber: 19, durationMs: 210000, danceability: 0.60, energy: 0.52, valence: 0.35, tempo: 80.0, acousticness: 0.25 },
          { title: "PITáGORA", trackNumber: 20, durationMs: 188000, danceability: 0.75, energy: 0.70, valence: 0.52, tempo: 96.0, acousticness: 0.08 },
          { title: "UN MUERTO BRINCA", trackNumber: 21, durationMs: 208000, danceability: 0.70, energy: 0.66, valence: 0.45, tempo: 90.0, acousticness: 0.12 },
          { title: "LAS MUJERES YA NO LLORAN", trackNumber: 22, durationMs: 230000, danceability: 0.58, energy: 0.48, valence: 0.28, tempo: 76.0, acousticness: 0.30 },
        ],
      },
    },
  });

  // --- DeBi TiRAR MaS FOToS (2025) ---
  const debiTirar = await prisma.album.create({
    data: {
      slug: "debi-tirar",
      title: "DeBí TiRAR MáS FOToS",
      year: 2025,
      themeId: "debi-tirar",
      spotifyId: "5K79FLRUCSysQnVESLcTdb",
      appleMusicId: "1787022393",
      coverUrl: "/images/albums/debi-tirar.jpg",
      description:
        "DeBí TiRAR MáS FOToS es el sexto álbum de Bad Bunny, un homenaje a Puerto Rico. Fusiona reggaetón con salsa, plena, bomba y jíbaro, creando una carta de amor a la isla.",
      descriptionEn:
        "DeBí TiRAR MáS FOToS is Bad Bunny's sixth album, a tribute to Puerto Rico. It fuses reggaeton with salsa, plena, bomba, and jíbaro music, creating a love letter to the island.",
      tracks: {
        create: [
          { title: "NueVo", trackNumber: 1, durationMs: 178000, danceability: 0.72, energy: 0.65, valence: 0.55, tempo: 92.0, acousticness: 0.18 },
          { title: "DtMF", trackNumber: 2, durationMs: 248000, danceability: 0.68, energy: 0.58, valence: 0.45, tempo: 86.0, acousticness: 0.25 },
          { title: "BAILE INoLVIDABLE", trackNumber: 3, durationMs: 210000, danceability: 0.85, energy: 0.78, valence: 0.72, tempo: 105.0, acousticness: 0.05 },
          { title: "WeLoSaBeMoS", trackNumber: 4, durationMs: 195000, danceability: 0.80, energy: 0.72, valence: 0.65, tempo: 98.0, acousticness: 0.08 },
          { title: "TuRiSTa", trackNumber: 5, durationMs: 224000, danceability: 0.75, energy: 0.68, valence: 0.58, tempo: 94.0, acousticness: 0.12 },
          { title: "BoKeTE", trackNumber: 6, durationMs: 205000, danceability: 0.82, energy: 0.76, valence: 0.68, tempo: 100.0, acousticness: 0.06 },
          { title: "KLouFRENiA", trackNumber: 7, durationMs: 188000, danceability: 0.70, energy: 0.62, valence: 0.48, tempo: 88.0, acousticness: 0.15 },
          { title: "VeLDá", trackNumber: 8, durationMs: 215000, danceability: 0.65, energy: 0.55, valence: 0.38, tempo: 82.0, acousticness: 0.22 },
          { title: "EoO", trackNumber: 9, durationMs: 196000, danceability: 0.78, energy: 0.70, valence: 0.60, tempo: 96.0, acousticness: 0.08 },
          { title: "PiTaHaYa", trackNumber: 10, durationMs: 232000, danceability: 0.76, energy: 0.68, valence: 0.55, tempo: 92.0, acousticness: 0.12 },
          { title: "CaFé CoN RoN", trackNumber: 11, durationMs: 218000, danceability: 0.72, energy: 0.60, valence: 0.50, tempo: 88.0, acousticness: 0.20 },
          { title: "LoS PaReDONeS", trackNumber: 12, durationMs: 187000, danceability: 0.80, energy: 0.74, valence: 0.62, tempo: 100.0, acousticness: 0.06 },
          { title: "KETU TeCRéE", trackNumber: 13, durationMs: 203000, danceability: 0.77, energy: 0.70, valence: 0.58, tempo: 95.0, acousticness: 0.10 },
          { title: "BiCHoTa SeaSoN", trackNumber: 14, durationMs: 192000, featuring: "Villano Antillano", danceability: 0.84, energy: 0.80, valence: 0.72, tempo: 108.0, acousticness: 0.03 },
          { title: "VoY a LLeVaRTe Pa PR", trackNumber: 15, durationMs: 228000, danceability: 0.70, energy: 0.62, valence: 0.48, tempo: 88.0, acousticness: 0.18 },
          { title: "LoS TRaPiToS", trackNumber: 16, durationMs: 175000, danceability: 0.78, energy: 0.72, valence: 0.60, tempo: 96.0, acousticness: 0.08 },
          { title: "Goodbye", trackNumber: 17, durationMs: 264000, danceability: 0.55, energy: 0.45, valence: 0.28, tempo: 72.0, acousticness: 0.38 },
        ],
      },
    },
  });

  console.log(`Created ${6} albums with tracks`);

  // ============================================================
  // AWARDS (~50+)
  // ============================================================
  const awards = await prisma.award.createMany({
    data: [
      // ── Grammy Awards ──────────────────────────────────────────
      // 61st Grammy Awards (2019)
      { title: "Record of the Year - I Like It", ceremony: "GRAMMY", category: "Record of the Year", year: 2019, result: "NOMINATED" },
      // 62nd Grammy Awards (2020)
      { title: "Best Latin Pop or Urban Album - X 100PRE", ceremony: "GRAMMY", category: "Best Latin Pop or Urban Album", year: 2020, result: "NOMINATED" },
      { title: "Best Latin Pop or Urban Album - Oasis", ceremony: "GRAMMY", category: "Best Latin Pop or Urban Album", year: 2020, result: "NOMINATED" },
      // 63rd Grammy Awards (2021)
      { title: "Best Latin Pop or Urban Album - YHLQMDLG", ceremony: "GRAMMY", category: "Best Latin Pop or Urban Album", year: 2021, result: "WON" },
      // 64th Grammy Awards (2022)
      { title: "Best Música Urbana Album - El Último Tour Del Mundo", ceremony: "GRAMMY", category: "Best Música Urbana Album", year: 2022, result: "WON" },
      { title: "Record of the Year - Dakiti", ceremony: "GRAMMY", category: "Record of the Year", year: 2022, result: "NOMINATED" },
      // 65th Grammy Awards (2023)
      { title: "Best Música Urbana Album - Un Verano Sin Ti", ceremony: "GRAMMY", category: "Best Música Urbana Album", year: 2023, result: "WON" },
      { title: "Album of the Year - Un Verano Sin Ti", ceremony: "GRAMMY", category: "Album of the Year", year: 2023, result: "NOMINATED" },
      { title: "Best Pop Solo Performance - Moscow Mule", ceremony: "GRAMMY", category: "Best Pop Solo Performance", year: 2023, result: "NOMINATED" },
      // 67th Grammy Awards (2025) — no nominations at 66th (2024)
      { title: "Best Música Urbana Album - Nadie Sabe Lo Que Va a Pasar Mañana", ceremony: "GRAMMY", category: "Best Música Urbana Album", year: 2025, result: "NOMINATED" },
      // 68th Grammy Awards (2026)
      { title: "Album of the Year - DeBí TiRAR MáS FOToS", ceremony: "GRAMMY", category: "Album of the Year", year: 2026, result: "WON" },
      { title: "Best Música Urbana Album - DeBí TiRAR MáS FOToS", ceremony: "GRAMMY", category: "Best Música Urbana Album", year: 2026, result: "WON" },
      { title: "Best Global Music Performance - EoO", ceremony: "GRAMMY", category: "Best Global Music Performance", year: 2026, result: "WON" },
      { title: "Record of the Year - DtMF", ceremony: "GRAMMY", category: "Record of the Year", year: 2026, result: "NOMINATED" },
      { title: "Song of the Year - DtMF", ceremony: "GRAMMY", category: "Song of the Year", year: 2026, result: "NOMINATED" },
      { title: "Best Recording Package - DeBí TiRAR MáS FOToS", ceremony: "GRAMMY", category: "Best Recording Package", year: 2026, result: "NOMINATED" },

      // ── Latin Grammy Awards ────────────────────────────────────
      // 19th Latin Grammy Awards (2018)
      { title: "Best Urban Song - Sensualidad", ceremony: "LATIN_GRAMMY", category: "Best Urban Song", year: 2018, result: "NOMINATED" },
      { title: "Best Urban Fusion/Performance - Si Tu Novio Te Deja Sola", ceremony: "LATIN_GRAMMY", category: "Best Urban Fusion/Performance", year: 2018, result: "NOMINATED" },
      // 20th Latin Grammy Awards (2019)
      { title: "Best Urban Music Album - X 100PRE", ceremony: "LATIN_GRAMMY", category: "Best Urban Music Album", year: 2019, result: "WON" },
      // 21st Latin Grammy Awards (2020)
      { title: "Album of the Year - YHLQMDLG", ceremony: "LATIN_GRAMMY", category: "Album of the Year", year: 2020, result: "NOMINATED" },
      { title: "Record of the Year - Vete", ceremony: "LATIN_GRAMMY", category: "Record of the Year", year: 2020, result: "NOMINATED" },
      { title: "Best Urban Music Album - YHLQMDLG", ceremony: "LATIN_GRAMMY", category: "Best Urban Music Album", year: 2020, result: "WON" },
      { title: "Best Reggaeton Performance - Yo Perreo Sola", ceremony: "LATIN_GRAMMY", category: "Best Reggaeton Performance", year: 2020, result: "WON" },
      // 22nd Latin Grammy Awards (2021)
      { title: "Album of the Year - El Último Tour Del Mundo", ceremony: "LATIN_GRAMMY", category: "Album of the Year", year: 2021, result: "NOMINATED" },
      { title: "Best Urban Music Album - El Último Tour Del Mundo", ceremony: "LATIN_GRAMMY", category: "Best Urban Music Album", year: 2021, result: "WON" },
      { title: "Best Reggaeton Performance - Dákiti", ceremony: "LATIN_GRAMMY", category: "Best Reggaeton Performance", year: 2021, result: "WON" },
      { title: "Best Rap/Hip-Hop Song - Booker T", ceremony: "LATIN_GRAMMY", category: "Best Rap/Hip-Hop Song", year: 2021, result: "WON" },
      { title: "Best Urban Song - Dákiti", ceremony: "LATIN_GRAMMY", category: "Best Urban Song", year: 2021, result: "NOMINATED" },
      // 23rd Latin Grammy Awards (2022)
      { title: "Album of the Year - Un Verano Sin Ti", ceremony: "LATIN_GRAMMY", category: "Album of the Year", year: 2022, result: "NOMINATED" },
      { title: "Record of the Year - Ojitos Lindos", ceremony: "LATIN_GRAMMY", category: "Record of the Year", year: 2022, result: "NOMINATED" },
      { title: "Best Urban Music Album - Un Verano Sin Ti", ceremony: "LATIN_GRAMMY", category: "Best Urban Music Album", year: 2022, result: "WON" },
      { title: "Best Urban Fusion/Performance - Tití Me Preguntó", ceremony: "LATIN_GRAMMY", category: "Best Urban Fusion/Performance", year: 2022, result: "WON" },
      { title: "Best Urban Song - Tití Me Preguntó", ceremony: "LATIN_GRAMMY", category: "Best Urban Song", year: 2022, result: "WON" },
      // 24th Latin Grammy Awards (2023)
      { title: "Best Regional Mexican Song - Un x100to", ceremony: "LATIN_GRAMMY", category: "Best Regional Mexican Song", year: 2023, result: "WON" },
      { title: "Song of the Year - Un x100to", ceremony: "LATIN_GRAMMY", category: "Song of the Year", year: 2023, result: "NOMINATED" },
      // 25th Latin Grammy Awards (2024)
      { title: "Record of the Year - Monaco", ceremony: "LATIN_GRAMMY", category: "Record of the Year", year: 2024, result: "NOMINATED" },
      { title: "Best Urban Music Album - Nadie Sabe Lo Que Va a Pasar Mañana", ceremony: "LATIN_GRAMMY", category: "Best Urban Music Album", year: 2024, result: "NOMINATED" },
      { title: "Best Urban Fusion/Performance - Nadie Sabe", ceremony: "LATIN_GRAMMY", category: "Best Urban Fusion/Performance", year: 2024, result: "NOMINATED" },
      { title: "Best Reggaeton Performance - Perro Negro", ceremony: "LATIN_GRAMMY", category: "Best Reggaeton Performance", year: 2024, result: "NOMINATED" },
      { title: "Best Reggaeton Performance - Un Preview", ceremony: "LATIN_GRAMMY", category: "Best Reggaeton Performance", year: 2024, result: "NOMINATED" },
      { title: "Best Short Form Music Video - Baticano", ceremony: "LATIN_GRAMMY", category: "Best Short Form Music Video", year: 2024, result: "NOMINATED" },
      // 26th Latin Grammy Awards (2025)
      { title: "Album of the Year - DeBí TiRAR MáS FOToS", ceremony: "LATIN_GRAMMY", category: "Album of the Year", year: 2025, result: "WON" },
      { title: "Best Urban Music Album - DeBí TiRAR MáS FOToS", ceremony: "LATIN_GRAMMY", category: "Best Urban Music Album", year: 2025, result: "WON" },
      { title: "Best Urban Song - DtMF", ceremony: "LATIN_GRAMMY", category: "Best Urban Song", year: 2025, result: "WON" },
      { title: "Best Urban/Fusion Performance - DtMF", ceremony: "LATIN_GRAMMY", category: "Best Urban/Fusion Performance", year: 2025, result: "WON" },
      { title: "Best Reggaeton Performance - Voy a Llevarte Pa' PR", ceremony: "LATIN_GRAMMY", category: "Best Reggaeton Performance", year: 2025, result: "WON" },
      { title: "Record of the Year - DtMF", ceremony: "LATIN_GRAMMY", category: "Record of the Year", year: 2025, result: "NOMINATED" },
      { title: "Record of the Year - Baile Inolvidable", ceremony: "LATIN_GRAMMY", category: "Record of the Year", year: 2025, result: "NOMINATED" },

      // ── Billboard Latin Music Awards ───────────────────────────
      { title: "Top Latin Artist", ceremony: "BILLBOARD", category: "Top Latin Artist", year: 2019, result: "WON" },
      { title: "Latin Rhythm Artist of the Year, Solo", ceremony: "BILLBOARD", category: "Latin Rhythm Artist of the Year, Solo", year: 2019, result: "WON" },
      { title: "Artist of the Year", ceremony: "BILLBOARD", category: "Artist of the Year", year: 2020, result: "WON" },
      { title: "Songwriter of the Year", ceremony: "BILLBOARD", category: "Songwriter of the Year", year: 2020, result: "WON" },
      { title: "Top Latin Artist", ceremony: "BILLBOARD", category: "Top Latin Artist", year: 2021, result: "WON" },
      { title: "Top Latin Album - YHLQMDLG", ceremony: "BILLBOARD", category: "Top Latin Album of the Year", year: 2021, result: "WON" },
      { title: "Hot Latin Song of the Year - Dákiti", ceremony: "BILLBOARD", category: "Hot Latin Song of the Year", year: 2021, result: "WON" },
      { title: "Songwriter of the Year", ceremony: "BILLBOARD", category: "Songwriter of the Year", year: 2021, result: "WON" },
      { title: "Top Latin Artist", ceremony: "BILLBOARD", category: "Top Latin Artist", year: 2022, result: "WON" },
      { title: "Top Latin Album - Un Verano Sin Ti", ceremony: "BILLBOARD", category: "Top Latin Album of the Year", year: 2022, result: "WON" },
      { title: "Tour of the Year", ceremony: "BILLBOARD", category: "Tour of the Year", year: 2022, result: "WON" },
      { title: "Songwriter of the Year", ceremony: "BILLBOARD", category: "Songwriter of the Year", year: 2022, result: "WON" },
      { title: "Hot Latin Song of the Year - Me Porto Bonito", ceremony: "BILLBOARD", category: "Hot Latin Song of the Year", year: 2022, result: "WON" },
      { title: "Top Latin Artist", ceremony: "BILLBOARD", category: "Top Latin Artist", year: 2023, result: "WON" },
      { title: "Tour of the Year", ceremony: "BILLBOARD", category: "Tour of the Year", year: 2023, result: "WON" },
      { title: "Song of the Year - Tití Me Preguntó", ceremony: "BILLBOARD", category: "Song of the Year", year: 2023, result: "WON" },
      { title: "Top Latin Artist", ceremony: "BILLBOARD", category: "Top Latin Artist", year: 2024, result: "WON" },
      { title: "Top Latin Album - Nadie Sabe Lo Que Va a Pasar Mañana", ceremony: "BILLBOARD", category: "Top Latin Album of the Year", year: 2024, result: "WON" },
      { title: "Latin Rhythm Song - WHERE SHE GOES", ceremony: "BILLBOARD", category: "Latin Rhythm Song of the Year", year: 2024, result: "WON" },
      { title: "Top Latin Artist", ceremony: "BILLBOARD", category: "Top Latin Artist", year: 2025, result: "WON" },
      { title: "Top Latin Album - DeBí TiRAR MáS FOToS", ceremony: "BILLBOARD", category: "Top Latin Album of the Year", year: 2025, result: "WON" },
      { title: "Hot Latin Song of the Year - DtMF", ceremony: "BILLBOARD", category: "Hot Latin Song of the Year", year: 2025, result: "WON" },
      { title: "Top Latin Artist of the 21st Century", ceremony: "BILLBOARD", category: "Top Latin Artist of the 21st Century", year: 2025, result: "WON" },

      // ── MTV VMAs ───────────────────────────────────────────────
      { title: "Best Latin - MIA", ceremony: "MTV", category: "Best Latin", year: 2019, result: "NOMINATED" },
      { title: "Best Latin - Yo Perreo Sola", ceremony: "MTV", category: "Best Latin", year: 2020, result: "NOMINATED" },
      { title: "Best Latin - Dákiti", ceremony: "MTV", category: "Best Latin", year: 2021, result: "NOMINATED" },
      { title: "Artist of the Year", ceremony: "MTV", category: "Artist of the Year", year: 2022, result: "WON" },
      { title: "Best Latin - Tití Me Preguntó", ceremony: "MTV", category: "Best Latin", year: 2022, result: "NOMINATED" },
      { title: "Album of the Year - Un Verano Sin Ti", ceremony: "MTV", category: "Album of the Year", year: 2022, result: "NOMINATED" },
      { title: "Best Latin - un x100to", ceremony: "MTV", category: "Best Latin", year: 2023, result: "NOMINATED" },
      { title: "Best Latin - Monaco", ceremony: "MTV", category: "Best Latin", year: 2024, result: "NOMINATED" },
      { title: "Best Latin - Baile Inolvidable", ceremony: "MTV", category: "Best Latin", year: 2025, result: "NOMINATED" },

      // ── American Music Awards ──────────────────────────────────
      { title: "Favorite Male Latin Artist", ceremony: "AMERICAN_MUSIC", category: "Favorite Male Latin Artist", year: 2020, result: "WON" },
      { title: "Favorite Latin Album - El Último Tour Del Mundo", ceremony: "AMERICAN_MUSIC", category: "Favorite Latin Album", year: 2020, result: "WON" },
      { title: "Favorite Male Latin Artist", ceremony: "AMERICAN_MUSIC", category: "Favorite Male Latin Artist", year: 2021, result: "WON" },
      { title: "Favorite Latin Album - El Último Tour Del Mundo", ceremony: "AMERICAN_MUSIC", category: "Favorite Latin Album", year: 2021, result: "WON" },
      { title: "Favorite Male Latin Artist", ceremony: "AMERICAN_MUSIC", category: "Favorite Male Latin Artist", year: 2022, result: "WON" },
      { title: "Favorite Latin Album - Un Verano Sin Ti", ceremony: "AMERICAN_MUSIC", category: "Favorite Latin Album", year: 2022, result: "WON" },
      { title: "Artist of the Year", ceremony: "AMERICAN_MUSIC", category: "Artist of the Year", year: 2022, result: "NOMINATED" },
      { title: "Favorite Male Latin Artist", ceremony: "AMERICAN_MUSIC", category: "Favorite Male Latin Artist", year: 2025, result: "WON" },
      { title: "Favorite Latin Album - DeBí TiRAR MáS FOToS", ceremony: "AMERICAN_MUSIC", category: "Favorite Latin Album", year: 2025, result: "WON" },

      // ── Other Awards ───────────────────────────────────────────
      { title: "Most Streamed Artist on Spotify (2020)", ceremony: "OTHER", category: "Most Streamed Artist on Spotify", year: 2020, result: "WON" },
      { title: "Most Streamed Artist on Spotify (2021)", ceremony: "OTHER", category: "Most Streamed Artist on Spotify", year: 2021, result: "WON" },
      { title: "Most Streamed Artist on Spotify (2022)", ceremony: "OTHER", category: "Most Streamed Artist on Spotify", year: 2022, result: "WON" },
      { title: "TIME 100 Most Influential People", ceremony: "OTHER", category: "TIME 100", year: 2020, result: "WON" },
    ],
  });

  console.log(`Created ${awards.count} awards`);

  // ============================================================
  // TIMELINE EVENTS (~30+)
  // ============================================================
  const timelineEvents = await prisma.timelineEvent.createMany({
    data: [
      {
        title: "Comienza a subir música a SoundCloud",
        titleEn: "Starts uploading music to SoundCloud",
        description: "Benito Antonio Martínez Ocasio comienza a subir canciones a SoundCloud mientras empaca bolsas en un supermercado.",
        descriptionEn: "Benito Antonio Martínez Ocasio begins uploading songs to SoundCloud while bagging groceries at a supermarket.",
        date: new Date("2013-06-01"),
        era: "origins",
        type: "MILESTONE",
        importance: 5,
      },
      {
        title: "\"Diles\" se vuelve viral",
        titleEn: "\"Diles\" goes viral",
        description: "La canción \"Diles\" gana tracción masiva en SoundCloud, atrayendo la atención de DJ Luian y Mambo Kingz.",
        descriptionEn: "The song \"Diles\" gains massive traction on SoundCloud, attracting the attention of DJ Luian and Mambo Kingz.",
        date: new Date("2016-11-01"),
        era: "origins",
        type: "RELEASE",
        importance: 5,
      },
      {
        title: "Firma con Hear This Music",
        titleEn: "Signs with Hear This Music",
        description: "Bad Bunny firma su primer contrato discográfico con el sello Hear This Music de DJ Luian.",
        descriptionEn: "Bad Bunny signs his first record deal with DJ Luian's label Hear This Music.",
        date: new Date("2017-01-15"),
        era: "origins",
        type: "MILESTONE",
        importance: 4,
      },
      {
        title: "\"Soy Peor\" rompe récords",
        titleEn: "\"Soy Peor\" breaks records",
        description: "\"Soy Peor\" se convierte en un éxito masivo, acumulando millones de reproducciones y consolidando a Bad Bunny en el mainstream.",
        descriptionEn: "\"Soy Peor\" becomes a massive hit, accumulating millions of streams and establishing Bad Bunny in the mainstream.",
        date: new Date("2017-01-01"),
        era: "origins",
        type: "RELEASE",
        importance: 5,
      },
      {
        title: "Colaboración con Cardi B en \"I Like It\"",
        titleEn: "Collaboration with Cardi B on \"I Like It\"",
        description: "Bad Bunny aparece junto a J Balvin en \"I Like It\" de Cardi B, que llega al #1 del Billboard Hot 100.",
        descriptionEn: "Bad Bunny appears alongside J Balvin on Cardi B's \"I Like It\", which reaches #1 on the Billboard Hot 100.",
        date: new Date("2018-05-25"),
        era: "x100pre",
        type: "COLLABORATION",
        importance: 5,
      },
      {
        title: "Lanzamiento de X 100PRE",
        titleEn: "X 100PRE release",
        description: "Bad Bunny lanza su álbum debut X 100PRE la Nochebuena, con colaboraciones con Drake, Diplo y El Alfa.",
        descriptionEn: "Bad Bunny releases his debut album X 100PRE on Christmas Eve, featuring collaborations with Drake, Diplo, and El Alfa.",
        date: new Date("2018-12-24"),
        era: "x100pre",
        type: "RELEASE",
        importance: 5,
      },
      {
        title: "Aparición en WWE Royal Rumble",
        titleEn: "WWE Royal Rumble appearance",
        description: "Bad Bunny se presenta en el WWE Royal Rumble, fusionando su amor por la lucha libre con su música.",
        descriptionEn: "Bad Bunny performs at the WWE Royal Rumble, fusing his love of wrestling with his music.",
        date: new Date("2019-01-27"),
        era: "x100pre",
        type: "MILESTONE",
        importance: 4,
      },
      {
        title: "Presentación en Coachella",
        titleEn: "Coachella performance",
        description: "Bad Bunny se presenta en el festival Coachella, consolidando su estatus como artista global.",
        descriptionEn: "Bad Bunny performs at Coachella festival, solidifying his status as a global artist.",
        date: new Date("2019-04-14"),
        era: "x100pre",
        type: "CONCERT",
        importance: 4,
      },
      {
        title: "Oasis con J Balvin",
        titleEn: "Oasis with J Balvin",
        description: "Bad Bunny y J Balvin lanzan el álbum colaborativo Oasis, con hits como \"Qué Pretendes\" y \"La Canción\".",
        descriptionEn: "Bad Bunny and J Balvin release the collaborative album Oasis, featuring hits like \"Qué Pretendes\" and \"La Canción\".",
        date: new Date("2019-06-28"),
        era: "x100pre",
        type: "RELEASE",
        importance: 4,
      },
      {
        title: "Lanzamiento de YHLQMDLG",
        titleEn: "YHLQMDLG release",
        description: "Bad Bunny sorprende al mundo con YHLQMDLG, un álbum que celebra el reggaetón clásico y la música latina.",
        descriptionEn: "Bad Bunny surprises the world with YHLQMDLG, an album celebrating classic reggaeton and Latin music.",
        date: new Date("2020-02-29"),
        era: "yhlqmdlg",
        type: "RELEASE",
        importance: 5,
      },
      {
        title: "Artista más escuchado en Spotify 2020",
        titleEn: "Most-streamed artist on Spotify 2020",
        description: "Bad Bunny se convierte en el artista más escuchado en Spotify globalmente en 2020.",
        descriptionEn: "Bad Bunny becomes the most-streamed artist on Spotify globally in 2020.",
        date: new Date("2020-12-01"),
        era: "yhlqmdlg",
        type: "MILESTONE",
        importance: 5,
      },
      {
        title: "Lanzamiento de El Último Tour Del Mundo",
        titleEn: "El Último Tour Del Mundo release",
        description: "Bad Bunny lanza su tercer álbum, convirtiéndose en el primer álbum completamente en español en llegar al #1 del Billboard 200.",
        descriptionEn: "Bad Bunny releases his third album, becoming the first all-Spanish album to reach #1 on the Billboard 200.",
        date: new Date("2020-11-27"),
        era: "ultimo-tour",
        type: "RELEASE",
        importance: 5,
      },
      {
        title: "Primer Grammy - Best Música Urbana Album",
        titleEn: "First Grammy - Best Música Urbana Album",
        description: "Bad Bunny gana su primer Grammy por YHLQMDLG en la categoría Best Música Urbana Album.",
        descriptionEn: "Bad Bunny wins his first Grammy for YHLQMDLG in the Best Música Urbana Album category.",
        date: new Date("2021-03-14"),
        era: "ultimo-tour",
        type: "AWARD",
        importance: 5,
      },
      {
        title: "Lucha en WrestleMania 37",
        titleEn: "Wrestles at WrestleMania 37",
        description: "Bad Bunny lucha en WrestleMania 37 en un tag team match, demostrando sus habilidades atléticas.",
        descriptionEn: "Bad Bunny wrestles at WrestleMania 37 in a tag team match, showcasing his athletic abilities.",
        date: new Date("2021-04-10"),
        era: "ultimo-tour",
        type: "MILESTONE",
        importance: 4,
      },
      {
        title: "Artista más escuchado en Spotify 2021",
        titleEn: "Most-streamed artist on Spotify 2021",
        description: "Bad Bunny repite como el artista más escuchado en Spotify por segundo año consecutivo.",
        descriptionEn: "Bad Bunny repeats as the most-streamed artist on Spotify for the second consecutive year.",
        date: new Date("2021-12-01"),
        era: "ultimo-tour",
        type: "MILESTONE",
        importance: 4,
      },
      {
        title: "Lanzamiento de Un Verano Sin Ti",
        titleEn: "Un Verano Sin Ti release",
        description: "Bad Bunny lanza Un Verano Sin Ti, que se convierte en el álbum más escuchado del año en Spotify y rompe múltiples récords.",
        descriptionEn: "Bad Bunny releases Un Verano Sin Ti, which becomes the most-streamed album of the year on Spotify and breaks multiple records.",
        date: new Date("2022-05-06"),
        era: "verano",
        type: "RELEASE",
        importance: 5,
      },
      {
        title: "World's Hottest Tour comienza",
        titleEn: "World's Hottest Tour begins",
        description: "Bad Bunny inicia su gira World's Hottest Tour, la gira latina más taquillera de la historia.",
        descriptionEn: "Bad Bunny kicks off his World's Hottest Tour, the highest-grossing Latin tour in history.",
        date: new Date("2022-08-05"),
        era: "verano",
        type: "CONCERT",
        importance: 5,
      },
      {
        title: "Artista más escuchado en Spotify 2022",
        titleEn: "Most-streamed artist on Spotify 2022",
        description: "Bad Bunny se convierte en el artista más escuchado en Spotify por tercer año consecutivo.",
        descriptionEn: "Bad Bunny becomes the most-streamed artist on Spotify for the third consecutive year.",
        date: new Date("2022-11-30"),
        era: "verano",
        type: "MILESTONE",
        importance: 5,
      },
      {
        title: "Nominación al Album of the Year en los Grammys",
        titleEn: "Grammy Album of the Year nomination",
        description: "Un Verano Sin Ti es nominado a Album of the Year en los Grammy Awards, una primera para un álbum completamente en español.",
        descriptionEn: "Un Verano Sin Ti is nominated for Album of the Year at the Grammy Awards, a first for an all-Spanish album.",
        date: new Date("2022-11-15"),
        era: "verano",
        type: "AWARD",
        importance: 5,
      },
      {
        title: "Segundo Grammy consecutivo",
        titleEn: "Second consecutive Grammy",
        description: "Bad Bunny gana su segundo Grammy por El Último Tour Del Mundo.",
        descriptionEn: "Bad Bunny wins his second Grammy for El Último Tour Del Mundo.",
        date: new Date("2022-04-03"),
        era: "verano",
        type: "AWARD",
        importance: 5,
      },
      {
        title: "Tercer Grammy - Un Verano Sin Ti",
        titleEn: "Third Grammy - Un Verano Sin Ti",
        description: "Bad Bunny gana su tercer Grammy consecutivo por Un Verano Sin Ti.",
        descriptionEn: "Bad Bunny wins his third consecutive Grammy for Un Verano Sin Ti.",
        date: new Date("2023-02-05"),
        era: "verano",
        type: "AWARD",
        importance: 5,
      },
      {
        title: "Show del medio tiempo del Super Bowl (invitado)",
        titleEn: "Super Bowl Halftime Show (guest)",
        description: "Bad Bunny se presenta como invitado especial durante el espectáculo del medio tiempo del Super Bowl.",
        descriptionEn: "Bad Bunny performs as a special guest during the Super Bowl halftime show.",
        date: new Date("2020-02-02"),
        era: "yhlqmdlg",
        type: "CONCERT",
        importance: 5,
      },
      {
        title: "Actuación en el show de medio tiempo del Super Bowl LVII",
        titleEn: "Super Bowl LVII Halftime performance reference",
        description: "Bad Bunny continúa consolidándose en eventos deportivos de gran escala en Estados Unidos.",
        descriptionEn: "Bad Bunny continues to establish himself at large-scale sporting events in the United States.",
        date: new Date("2023-02-12"),
        era: "nadie-sabe",
        type: "CONCERT",
        importance: 4,
      },
      {
        title: "Lanzamiento de Nadie Sabe Lo Que Va a Pasar Mañana",
        titleEn: "Nadie Sabe Lo Que Va a Pasar Mañana release",
        description: "Bad Bunny lanza su quinto álbum, explorando sonidos más oscuros y experimentales con colaboraciones con Feid y eladio carrión.",
        descriptionEn: "Bad Bunny releases his fifth album, exploring darker and more experimental sounds with collaborations featuring Feid and eladio carrión.",
        date: new Date("2023-10-13"),
        era: "nadie-sabe",
        type: "RELEASE",
        importance: 5,
      },
      {
        title: "Most Wanted Tour comienza",
        titleEn: "Most Wanted Tour begins",
        description: "Bad Bunny inicia su gira Most Wanted Tour por Norteamérica y América Latina.",
        descriptionEn: "Bad Bunny kicks off his Most Wanted Tour across North America and Latin America.",
        date: new Date("2024-02-21"),
        era: "nadie-sabe",
        type: "CONCERT",
        importance: 4,
      },
      {
        title: "Portada de Rolling Stone",
        titleEn: "Rolling Stone cover",
        description: "Bad Bunny aparece en la portada de Rolling Stone, reconocido como uno de los artistas más influyentes de la era moderna.",
        descriptionEn: "Bad Bunny appears on the cover of Rolling Stone, recognized as one of the most influential artists of the modern era.",
        date: new Date("2020-05-14"),
        era: "yhlqmdlg",
        type: "MILESTONE",
        importance: 3,
      },
      {
        title: "Portada de TIME 100",
        titleEn: "TIME 100 cover",
        description: "Bad Bunny es incluido en la lista TIME 100 de las personas más influyentes del mundo.",
        descriptionEn: "Bad Bunny is included in TIME 100's list of the most influential people in the world.",
        date: new Date("2020-09-22"),
        era: "yhlqmdlg",
        type: "MILESTONE",
        importance: 4,
      },
      {
        title: "Debut actoral en Bullet Train",
        titleEn: "Acting debut in Bullet Train",
        description: "Bad Bunny debuta como actor en la película de Hollywood Bullet Train junto a Brad Pitt.",
        descriptionEn: "Bad Bunny makes his acting debut in the Hollywood film Bullet Train alongside Brad Pitt.",
        date: new Date("2022-08-05"),
        era: "verano",
        type: "MILESTONE",
        importance: 3,
      },
      {
        title: "Papel en Cassandro",
        titleEn: "Role in Cassandro",
        description: "Bad Bunny actúa en la película Cassandro, mostrando su versatilidad como artista.",
        descriptionEn: "Bad Bunny acts in the film Cassandro, showcasing his versatility as an artist.",
        date: new Date("2023-09-15"),
        era: "nadie-sabe",
        type: "MILESTONE",
        importance: 3,
      },
      {
        title: "Lanzamiento de DeBí TiRAR MáS FOToS",
        titleEn: "DeBí TiRAR MáS FOToS release",
        description: "Bad Bunny lanza DeBí TiRAR MáS FOToS, un homenaje a Puerto Rico que fusiona reggaetón con salsa, plena y bomba.",
        descriptionEn: "Bad Bunny releases DeBí TiRAR MáS FOToS, a tribute to Puerto Rico that fuses reggaeton with salsa, plena, and bomba.",
        date: new Date("2025-01-05"),
        era: "debi-tirar",
        type: "RELEASE",
        importance: 5,
      },
      {
        title: "No Me Quiero Casar - Colaboración con Bad Gyal",
        titleEn: "No Me Quiero Casar - Collaboration with Bad Gyal",
        description: "La colaboración con Bad Gyal consolida lazos entre la escena urbana latina y europea.",
        descriptionEn: "The collaboration with Bad Gyal strengthens ties between the Latin and European urban scenes.",
        date: new Date("2023-10-20"),
        era: "nadie-sabe",
        type: "COLLABORATION",
        importance: 3,
      },
      {
        title: "WHERE SHE GOES alcanza el #1 global en Spotify",
        titleEn: "WHERE SHE GOES reaches #1 globally on Spotify",
        description: "WHERE SHE GOES se convierte en un éxito mundial, alcanzando el #1 en las listas globales de Spotify.",
        descriptionEn: "WHERE SHE GOES becomes a worldwide hit, reaching #1 on Spotify's global charts.",
        date: new Date("2023-05-18"),
        era: "nadie-sabe",
        type: "MILESTONE",
        importance: 4,
      },
    ],
  });

  console.log(`Created ${timelineEvents.count} timeline events`);

  // ============================================================
  // INTERVIEWS (~15)
  // ============================================================
  const interviews = await prisma.interview.createMany({
    data: [
      {
        slug: "tonight-show-2020",
        title: "Bad Bunny en The Tonight Show con Jimmy Fallon (2020)",
        titleEn: "Bad Bunny on The Tonight Show with Jimmy Fallon (2020)",
        outlet: "The Tonight Show Starring Jimmy Fallon",
        date: new Date("2020-03-02"),
        youtubeId: "gLYGPnFbXEU",
        description: "Bad Bunny se presenta en The Tonight Show para hablar sobre YHLQMDLG y performar en vivo.",
        descriptionEn: "Bad Bunny appears on The Tonight Show to discuss YHLQMDLG and perform live.",
        tags: "late-night,yhlqmdlg,performance",
        language: "es",
      },
      {
        slug: "tonight-show-2022",
        title: "Bad Bunny en The Tonight Show con Jimmy Fallon (2022)",
        titleEn: "Bad Bunny on The Tonight Show with Jimmy Fallon (2022)",
        outlet: "The Tonight Show Starring Jimmy Fallon",
        date: new Date("2022-05-09"),
        youtubeId: "xQ6xQMVOKSM",
        description: "Bad Bunny promociona Un Verano Sin Ti en el show de Fallon con una presentación especial.",
        descriptionEn: "Bad Bunny promotes Un Verano Sin Ti on Fallon's show with a special performance.",
        tags: "late-night,verano,performance",
        language: "es",
      },
      {
        slug: "rolling-stone-cover-2020",
        title: "Bad Bunny: Portada de Rolling Stone",
        titleEn: "Bad Bunny: Rolling Stone Cover Story",
        outlet: "Rolling Stone",
        date: new Date("2020-05-14"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Entrevista exclusiva de Rolling Stone sobre su vida, carrera y visión musical.",
        descriptionEn: "Exclusive Rolling Stone interview about his life, career, and musical vision.",
        tags: "magazine,cover-story,in-depth",
        language: "en",
      },
      {
        slug: "billboard-interview-2022",
        title: "Bad Bunny: Entrevista de Billboard",
        titleEn: "Bad Bunny: Billboard Interview",
        outlet: "Billboard",
        date: new Date("2022-06-15"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Billboard entrevista a Bad Bunny sobre el éxito de Un Verano Sin Ti y su impacto en la música latina.",
        descriptionEn: "Billboard interviews Bad Bunny about the success of Un Verano Sin Ti and its impact on Latin music.",
        tags: "magazine,verano,industry",
        language: "en",
      },
      {
        slug: "gordo-y-la-flaca-2019",
        title: "Bad Bunny en El Gordo y La Flaca",
        titleEn: "Bad Bunny on El Gordo y La Flaca",
        outlet: "El Gordo y La Flaca / Univision",
        date: new Date("2019-03-15"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Bad Bunny habla sobre su carrera, X 100PRE y sus próximos proyectos en El Gordo y La Flaca.",
        descriptionEn: "Bad Bunny discusses his career, X 100PRE, and upcoming projects on El Gordo y La Flaca.",
        tags: "television,spanish,x100pre",
        language: "es",
      },
      {
        slug: "vogue-interview-2022",
        title: "Bad Bunny: Entrevista de Vogue",
        titleEn: "Bad Bunny: Vogue Interview",
        outlet: "Vogue",
        date: new Date("2022-07-01"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Vogue entrevista a Bad Bunny sobre moda, identidad y su influencia cultural.",
        descriptionEn: "Vogue interviews Bad Bunny about fashion, identity, and his cultural influence.",
        tags: "fashion,culture,identity",
        language: "en",
      },
      {
        slug: "gq-interview-2023",
        title: "Bad Bunny: GQ Hombre del Año",
        titleEn: "Bad Bunny: GQ Man of the Year",
        outlet: "GQ",
        date: new Date("2023-11-01"),
        youtubeId: "dQw4w9WgXcQ",
        description: "GQ nombra a Bad Bunny Hombre del Año y lo entrevista sobre su evolución artística.",
        descriptionEn: "GQ names Bad Bunny Man of the Year and interviews him about his artistic evolution.",
        tags: "magazine,award,fashion,nadie-sabe",
        language: "en",
      },
      {
        slug: "colbert-late-show-2022",
        title: "Bad Bunny en The Late Show con Stephen Colbert",
        titleEn: "Bad Bunny on The Late Show with Stephen Colbert",
        outlet: "The Late Show with Stephen Colbert",
        date: new Date("2022-10-03"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Bad Bunny se presenta en The Late Show y habla sobre su gira y el éxito de Un Verano Sin Ti.",
        descriptionEn: "Bad Bunny appears on The Late Show and discusses his tour and the success of Un Verano Sin Ti.",
        tags: "late-night,verano,tour",
        language: "es",
      },
      {
        slug: "zane-lowe-apple-2023",
        title: "Bad Bunny con Zane Lowe - Apple Music",
        titleEn: "Bad Bunny with Zane Lowe - Apple Music",
        outlet: "Apple Music / Zane Lowe",
        date: new Date("2023-10-15"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Entrevista a profundidad con Zane Lowe sobre Nadie Sabe Lo Que Va a Pasar Mañana.",
        descriptionEn: "In-depth interview with Zane Lowe about Nadie Sabe Lo Que Va a Pasar Mañana.",
        tags: "music,in-depth,nadie-sabe,streaming",
        language: "en",
      },
      {
        slug: "tonight-show-2023",
        title: "Bad Bunny en The Tonight Show con Jimmy Fallon (2023)",
        titleEn: "Bad Bunny on The Tonight Show with Jimmy Fallon (2023)",
        outlet: "The Tonight Show Starring Jimmy Fallon",
        date: new Date("2023-10-18"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Bad Bunny regresa al show de Fallon para promocionar Nadie Sabe Lo Que Va a Pasar Mañana.",
        descriptionEn: "Bad Bunny returns to Fallon's show to promote Nadie Sabe Lo Que Va a Pasar Mañana.",
        tags: "late-night,nadie-sabe,performance",
        language: "es",
      },
      {
        slug: "face-to-face-2024",
        title: "Bad Bunny: Entrevista Cara a Cara",
        titleEn: "Bad Bunny: Face to Face Interview",
        outlet: "Cara a Cara",
        date: new Date("2024-03-15"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Una entrevista íntima donde Bad Bunny reflexiona sobre su carrera y legado.",
        descriptionEn: "An intimate interview where Bad Bunny reflects on his career and legacy.",
        tags: "spanish,in-depth,personal",
        language: "es",
      },
      {
        slug: "wwe-backstage-2021",
        title: "Bad Bunny: Backstage en WWE",
        titleEn: "Bad Bunny: WWE Backstage",
        outlet: "WWE",
        date: new Date("2021-04-10"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Bad Bunny habla sobre su amor por la lucha libre antes de su combate en WrestleMania.",
        descriptionEn: "Bad Bunny talks about his love for wrestling before his WrestleMania match.",
        tags: "wrestling,wwe,sports",
        language: "en",
      },
      {
        slug: "spotify-a-]la-carta-2020",
        title: "Bad Bunny en Spotify A La Carta",
        titleEn: "Bad Bunny on Spotify A La Carta",
        outlet: "Spotify",
        date: new Date("2020-03-15"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Bad Bunny conversa sobre el proceso creativo detrás de YHLQMDLG.",
        descriptionEn: "Bad Bunny discusses the creative process behind YHLQMDLG.",
        tags: "streaming,yhlqmdlg,creative-process",
        language: "es",
      },
      {
        slug: "debi-tirar-apple-2025",
        title: "Bad Bunny habla sobre DeBí TiRAR MáS FOToS",
        titleEn: "Bad Bunny discusses DeBí TiRAR MáS FOToS",
        outlet: "Apple Music",
        date: new Date("2025-01-10"),
        youtubeId: "dQw4w9WgXcQ",
        description: "Bad Bunny explica la inspiración detrás de su homenaje a Puerto Rico en DeBí TiRAR MáS FOToS.",
        descriptionEn: "Bad Bunny explains the inspiration behind his tribute to Puerto Rico in DeBí TiRAR MáS FOToS.",
        tags: "streaming,debi-tirar,puerto-rico",
        language: "es",
      },
    ],
  });

  console.log(`Created ${interviews.count} interviews`);

  // ============================================================
  // CONCERTS (~30)
  // ============================================================
  const concerts = await prisma.concert.createMany({
    data: [
      // X 100PRE Tour (2019) — opened Mar 8 at Choliseo, 61 dates across Americas & Europe
      { tourName: "X 100PRE Tour", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2019-03-08"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "X 100PRE Tour", venue: "AmericanAirlines Arena", city: "Miami", country: "United States", date: new Date("2019-03-14"), lat: 25.7814, lng: -80.1870, soldOut: true, capacity: 19600 },
      { tourName: "X 100PRE Tour", venue: "Madison Square Garden", city: "New York", country: "United States", date: new Date("2019-04-27"), lat: 40.7505, lng: -73.9934, soldOut: true, capacity: 20789 },
      { tourName: "X 100PRE Tour", venue: "Arena Ciudad de México", city: "Mexico City", country: "Mexico", date: new Date("2019-10-12"), lat: 19.4042, lng: -99.0907, soldOut: true, capacity: 22300 },
      { tourName: "X 100PRE Tour", venue: "Movistar Arena", city: "Bogotá", country: "Colombia", date: new Date("2019-06-22"), lat: 4.6384, lng: -74.0896, soldOut: true, capacity: 14000 },

      // P FKN R (2021) — standalone stadium shows at Hiram Bithorn, Dec 10-11
      { tourName: "P FKN R", venue: "Estadio Hiram Bithorn", city: "San Juan", country: "Puerto Rico", date: new Date("2021-12-10"), lat: 18.4268, lng: -66.0614, soldOut: true, capacity: 35000 },
      { tourName: "P FKN R", venue: "Estadio Hiram Bithorn", city: "San Juan", country: "Puerto Rico", date: new Date("2021-12-11"), lat: 18.4268, lng: -66.0614, soldOut: true, capacity: 35000 },

      // El Último Tour Del Mundo (2022) — arena tour, 25 cities, Feb 9 – Apr 3
      { tourName: "El Último Tour Del Mundo", venue: "Ball Arena", city: "Denver", country: "United States", date: new Date("2022-02-09"), lat: 39.7487, lng: -104.9994, soldOut: true, capacity: 19520 },
      { tourName: "El Último Tour Del Mundo", venue: "Toyota Center", city: "Houston", country: "United States", date: new Date("2022-02-16"), lat: 29.7508, lng: -95.3621, soldOut: true, capacity: 18300 },
      { tourName: "El Último Tour Del Mundo", venue: "Crypto.com Arena", city: "Los Angeles", country: "United States", date: new Date("2022-02-24"), lat: 34.0430, lng: -118.2673, soldOut: true, capacity: 20000 },
      { tourName: "El Último Tour Del Mundo", venue: "United Center", city: "Chicago", country: "United States", date: new Date("2022-03-05"), lat: 41.8807, lng: -87.6742, soldOut: true, capacity: 23500 },

      // World's Hottest Tour (2022) — stadium tour, 43 shows, $314M+ gross
      { tourName: "World's Hottest Tour", venue: "Coliseo de Puerto Rico", city: "San Juan", country: "Puerto Rico", date: new Date("2022-07-28"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "World's Hottest Tour", venue: "Camping World Stadium", city: "Orlando", country: "United States", date: new Date("2022-08-05"), lat: 28.5392, lng: -81.4029, soldOut: true, capacity: 60000 },
      { tourName: "World's Hottest Tour", venue: "Hard Rock Stadium", city: "Miami", country: "United States", date: new Date("2022-08-12"), lat: 25.9580, lng: -80.2389, soldOut: true, capacity: 65326 },
      { tourName: "World's Hottest Tour", venue: "Soldier Field", city: "Chicago", country: "United States", date: new Date("2022-08-20"), lat: 41.8623, lng: -87.6167, soldOut: true, capacity: 63500 },
      { tourName: "World's Hottest Tour", venue: "Yankee Stadium", city: "New York", country: "United States", date: new Date("2022-08-27"), lat: 40.8296, lng: -73.9262, soldOut: true, capacity: 54251 },
      { tourName: "World's Hottest Tour", venue: "Yankee Stadium", city: "New York", country: "United States", date: new Date("2022-08-28"), lat: 40.8296, lng: -73.9262, soldOut: true, capacity: 54251 },
      { tourName: "World's Hottest Tour", venue: "Chase Field", city: "Phoenix", country: "United States", date: new Date("2022-09-28"), lat: 33.4456, lng: -112.0667, soldOut: true, capacity: 48519 },
      { tourName: "World's Hottest Tour", venue: "SoFi Stadium", city: "Los Angeles", country: "United States", date: new Date("2022-09-30"), lat: 33.9535, lng: -118.3392, soldOut: true, capacity: 70240 },
      { tourName: "World's Hottest Tour", venue: "SoFi Stadium", city: "Los Angeles", country: "United States", date: new Date("2022-10-01"), lat: 33.9535, lng: -118.3392, soldOut: true, capacity: 70240 },
      { tourName: "World's Hottest Tour", venue: "Estadio Nacional", city: "Santiago", country: "Chile", date: new Date("2022-10-28"), lat: -33.4652, lng: -70.6100, soldOut: true, capacity: 48665 },
      { tourName: "World's Hottest Tour", venue: "Estadio Vélez Sarsfield", city: "Buenos Aires", country: "Argentina", date: new Date("2022-11-04"), lat: -34.6345, lng: -58.5216, soldOut: true, capacity: 49540 },
      { tourName: "World's Hottest Tour", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico", date: new Date("2022-12-09"), lat: 19.3029, lng: -99.1505, soldOut: true, capacity: 87523 },

      // Most Wanted Tour (2024) — arena tour, 48 dates, all sold out, $211M+
      { tourName: "Most Wanted Tour", venue: "Delta Center", city: "Salt Lake City", country: "United States", date: new Date("2024-02-21"), lat: 40.7683, lng: -111.9011, soldOut: true, capacity: 18300 },
      { tourName: "Most Wanted Tour", venue: "Crypto.com Arena", city: "Los Angeles", country: "United States", date: new Date("2024-03-13"), lat: 34.0430, lng: -118.2673, soldOut: true, capacity: 20000 },
      { tourName: "Most Wanted Tour", venue: "T-Mobile Center", city: "Kansas City", country: "United States", date: new Date("2024-03-26"), lat: 39.0970, lng: -94.5783, soldOut: true, capacity: 18972 },
      { tourName: "Most Wanted Tour", venue: "Barclays Center", city: "New York", country: "United States", date: new Date("2024-04-11"), lat: 40.6828, lng: -73.9758, soldOut: true, capacity: 19000 },
      { tourName: "Most Wanted Tour", venue: "Barclays Center", city: "New York", country: "United States", date: new Date("2024-04-12"), lat: 40.6828, lng: -73.9758, soldOut: true, capacity: 19000 },
      { tourName: "Most Wanted Tour", venue: "TD Garden", city: "Boston", country: "United States", date: new Date("2024-04-17"), lat: 42.3662, lng: -71.0621, soldOut: true, capacity: 19580 },
      { tourName: "Most Wanted Tour", venue: "Kaseya Center", city: "Miami", country: "United States", date: new Date("2024-05-24"), lat: 25.7814, lng: -80.1870, soldOut: true, capacity: 19600 },
      { tourName: "Most Wanted Tour", venue: "Coliseo de Puerto Rico", city: "San Juan", country: "Puerto Rico", date: new Date("2024-06-07"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },

      // No Me Quiero Ir De Aquí (2025) — 31-show residency at Choliseo, Jul 11 – Sep 20
      // ~400,000 tickets sold out in under 4 hours
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-07-11"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-07-12"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-07-13"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-07-18"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-07-19"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-07-20"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-07-25"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-07-26"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-07-27"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-01"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-02"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-03"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-08"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-09"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-10"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-15"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-16"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-17"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-22"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-23"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-24"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-29"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-30"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-08-31"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-09-05"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-09-06"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-09-07"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-09-12"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-09-13"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-09-14"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },
      { tourName: "No Me Quiero Ir De Aquí", venue: "Coliseo de Puerto Rico José Miguel Agrelot", city: "San Juan", country: "Puerto Rico", date: new Date("2025-09-20"), lat: 18.4274, lng: -66.0603, soldOut: true, capacity: 18000 },

      // Debí Tirar Más Fotos World Tour (2025–2026) — first world tour, 57 shows
      // Latin America & Caribbean
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Estadio Olímpico Félix Sánchez", city: "Santo Domingo", country: "Dominican Republic", date: new Date("2025-11-21"), lat: 18.4731, lng: -69.9113, soldOut: true, capacity: 45000 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Estadio Nacional", city: "San José", country: "Costa Rica", date: new Date("2025-12-05"), lat: 9.9366, lng: -84.0988, soldOut: true, capacity: 35000 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Estadio GNP Seguros", city: "Mexico City", country: "Mexico", date: new Date("2025-12-10"), lat: 19.4022, lng: -99.0919, soldOut: true, capacity: 65000 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Estadio Nacional", city: "Santiago", country: "Chile", date: new Date("2026-01-09"), lat: -33.4652, lng: -70.6100, soldOut: true, capacity: 48665 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Estadio Nacional", city: "Lima", country: "Peru", date: new Date("2026-01-16"), lat: -12.0676, lng: -77.0332, soldOut: true, capacity: 50086 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Estadio Atanasio Girardot", city: "Medellín", country: "Colombia", date: new Date("2026-01-23"), lat: 6.2561, lng: -75.5905, soldOut: true, capacity: 44826 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Estadio River Plate", city: "Buenos Aires", country: "Argentina", date: new Date("2026-02-13"), lat: -34.5454, lng: -58.4498, soldOut: false, capacity: 85000 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Allianz Parque", city: "São Paulo", country: "Brazil", date: new Date("2026-02-20"), lat: -23.5275, lng: -46.6789, soldOut: false, capacity: 43713 },
      // Australia
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "ENGIE Stadium", city: "Sydney", country: "Australia", date: new Date("2026-02-28"), lat: -33.8443, lng: 151.0647, soldOut: false, capacity: 23500 },
      // Japan
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Tokyo Dome", city: "Tokyo", country: "Japan", date: new Date("2026-03-14"), lat: 35.7056, lng: 139.7519, soldOut: false, capacity: 55000 },
      // Europe
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Estadi Olímpic Lluís Companys", city: "Barcelona", country: "Spain", date: new Date("2026-05-22"), lat: 41.3645, lng: 2.1559, soldOut: false, capacity: 55926 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Estádio da Luz", city: "Lisbon", country: "Portugal", date: new Date("2026-05-26"), lat: 38.7527, lng: -9.1849, soldOut: false, capacity: 68100 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Riyadh Air Metropolitano", city: "Madrid", country: "Spain", date: new Date("2026-05-30"), lat: 40.4361, lng: -3.5994, soldOut: false, capacity: 70692 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Merkur Spiel-Arena", city: "Düsseldorf", country: "Germany", date: new Date("2026-06-20"), lat: 51.2617, lng: 6.7348, soldOut: false, capacity: 66500 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "GelreDome", city: "Arnhem", country: "Netherlands", date: new Date("2026-06-23"), lat: 51.9630, lng: 5.8933, soldOut: false, capacity: 41000 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Tottenham Hotspur Stadium", city: "London", country: "United Kingdom", date: new Date("2026-06-27"), lat: 51.6043, lng: -0.0662, soldOut: false, capacity: 62850 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Orange Vélodrome", city: "Marseille", country: "France", date: new Date("2026-07-01"), lat: 43.2697, lng: 5.3956, soldOut: false, capacity: 67394 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Paris La Défense Arena", city: "Paris", country: "France", date: new Date("2026-07-04"), lat: 48.8958, lng: 2.2302, soldOut: false, capacity: 45000 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Strawberry Arena", city: "Stockholm", country: "Sweden", date: new Date("2026-07-10"), lat: 59.3720, lng: 18.0013, soldOut: false, capacity: 65000 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "PGE Narodowy", city: "Warsaw", country: "Poland", date: new Date("2026-07-14"), lat: 52.2395, lng: 21.0453, soldOut: false, capacity: 72900 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "Ippodromo SNAI La Maura", city: "Milan", country: "Italy", date: new Date("2026-07-17"), lat: 45.4930, lng: 9.1269, soldOut: false, capacity: 80000 },
      { tourName: "Debí Tirar Más Fotos World Tour", venue: "King Baudouin Stadium", city: "Brussels", country: "Belgium", date: new Date("2026-07-22"), lat: 50.8952, lng: 4.3340, soldOut: false, capacity: 50093 },
    ],
  });

  console.log(`Created ${concerts.count} concerts`);

  // ============================================================
  // GALLERY ITEMS
  // ============================================================
  const galleryItems = await prisma.galleryItem.createMany({
    data: [
      { type: "PHOTO", url: "/images/gallery/x100pre-cover-shoot.jpg", caption: "Sesión de fotos para la portada de X 100PRE", captionEn: "X 100PRE cover photo shoot", era: "x100pre", tags: "album,cover,photoshoot" },
      { type: "PHOTO", url: "/images/gallery/yhlqmdlg-studio.jpg", caption: "Bad Bunny en el estudio grabando YHLQMDLG", captionEn: "Bad Bunny in the studio recording YHLQMDLG", era: "yhlqmdlg", tags: "studio,recording,behind-the-scenes" },
      { type: "PHOTO", url: "/images/gallery/yo-perreo-sola-video.jpg", caption: "Detrás de cámaras del video Yo Perreo Sola", captionEn: "Behind the scenes of Yo Perreo Sola video", era: "yhlqmdlg", tags: "music-video,behind-the-scenes" },
      { type: "PHOTO", url: "/images/gallery/wrestlemania-37.jpg", caption: "Bad Bunny en WrestleMania 37", captionEn: "Bad Bunny at WrestleMania 37", era: "ultimo-tour", tags: "wrestling,wwe,sports" },
      { type: "PHOTO", url: "/images/gallery/verano-beach.jpg", caption: "Sesión de fotos en la playa para Un Verano Sin Ti", captionEn: "Beach photo shoot for Un Verano Sin Ti", era: "verano", tags: "album,photoshoot,beach" },
      { type: "PHOTO", url: "/images/gallery/worlds-hottest-tour-stage.jpg", caption: "Escenario del World's Hottest Tour", captionEn: "World's Hottest Tour stage", era: "verano", tags: "concert,tour,stage" },
      { type: "PHOTO", url: "/images/gallery/yankee-stadium.jpg", caption: "Bad Bunny agotando el Yankee Stadium", captionEn: "Bad Bunny selling out Yankee Stadium", era: "verano", tags: "concert,sold-out,stadium" },
      { type: "PHOTO", url: "/images/gallery/grammy-win-2023.jpg", caption: "Bad Bunny recibiendo su tercer Grammy", captionEn: "Bad Bunny receiving his third Grammy", era: "verano", tags: "award,grammy,ceremony" },
      { type: "PHOTO", url: "/images/gallery/nadie-sabe-promo.jpg", caption: "Foto promocional de Nadie Sabe Lo Que Va a Pasar Mañana", captionEn: "Nadie Sabe Lo Que Va a Pasar Mañana promo photo", era: "nadie-sabe", tags: "album,promo,photoshoot" },
      { type: "PHOTO", url: "/images/gallery/most-wanted-tour.jpg", caption: "Bad Bunny en el Most Wanted Tour", captionEn: "Bad Bunny at the Most Wanted Tour", era: "nadie-sabe", tags: "concert,tour" },
      { type: "PHOTO", url: "/images/gallery/debi-tirar-pr.jpg", caption: "Bad Bunny en Puerto Rico durante la era DeBí TiRAR MáS FOToS", captionEn: "Bad Bunny in Puerto Rico during the DeBí TiRAR MáS FOToS era", era: "debi-tirar", tags: "puerto-rico,album,personal" },
      { type: "ARTWORK", url: "/images/gallery/x100pre-fan-art.jpg", caption: "Fan art inspirado en X 100PRE", captionEn: "Fan art inspired by X 100PRE", era: "x100pre", tags: "fan-art,artwork" },
      { type: "ARTWORK", url: "/images/gallery/verano-illustration.jpg", caption: "Ilustración de Un Verano Sin Ti", captionEn: "Un Verano Sin Ti illustration", era: "verano", tags: "illustration,artwork,fan-art" },
      { type: "VIDEO", url: "/videos/gallery/coachella-2019-highlights.mp4", caption: "Momentos destacados de Coachella 2019", captionEn: "Coachella 2019 highlights", era: "x100pre", tags: "concert,festival,performance" },
      { type: "VIDEO", url: "/videos/gallery/worlds-hottest-tour-recap.mp4", caption: "Resumen del World's Hottest Tour", captionEn: "World's Hottest Tour recap", era: "verano", tags: "concert,tour,recap" },
    ],
  });

  console.log(`Created ${galleryItems.count} gallery items`);

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
