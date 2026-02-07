/**
 * Script to add 33 missing multi-night shows for the
 * "Debí Tirar Más Fotos World Tour" to the Turso database.
 *
 * Run: npx tsx scripts/add-missing-dtmf-shows.ts
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env.local manually since dotenv isn't installed
const envPath = resolve(__dirname, "..", ".env.local");
for (const line of readFileSync(envPath, "utf-8").split("\n")) {
  const match = line.match(/^(\w+)="?([^"]*)"?$/);
  if (match) process.env[match[1]] = match[2];
}

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function cuid() {
  return `cm${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

const TOUR = "Debí Tirar Más Fotos World Tour";

// Each entry: [date, city, country, venue, lat, lng, capacity, soldOut]
const missingShows: [string, string, string, string, number, number, number, boolean][] = [
  // Past shows (soldOut = true) — before Feb 7, 2026
  ["2025-11-22", "Santo Domingo", "Dominican Republic", "Estadio Olímpico Félix Sánchez", 18.4731, -69.9113, 45000, true],
  ["2025-12-06", "San José", "Costa Rica", "Estadio Nacional", 9.9366, -84.0988, 35000, true],
  ["2025-12-11", "Mexico City", "Mexico", "Estadio GNP Seguros", 19.4022, -99.0919, 65000, true],
  ["2025-12-12", "Mexico City", "Mexico", "Estadio GNP Seguros", 19.4022, -99.0919, 65000, true],
  ["2025-12-15", "Mexico City", "Mexico", "Estadio GNP Seguros", 19.4022, -99.0919, 65000, true],
  ["2025-12-16", "Mexico City", "Mexico", "Estadio GNP Seguros", 19.4022, -99.0919, 65000, true],
  ["2025-12-19", "Mexico City", "Mexico", "Estadio GNP Seguros", 19.4022, -99.0919, 65000, true],
  ["2025-12-20", "Mexico City", "Mexico", "Estadio GNP Seguros", 19.4022, -99.0919, 65000, true],
  ["2025-12-21", "Mexico City", "Mexico", "Estadio GNP Seguros", 19.4022, -99.0919, 65000, true],
  ["2026-01-10", "Santiago", "Chile", "Estadio Nacional", -33.4652, -70.6100, 48665, true],
  ["2026-01-11", "Santiago", "Chile", "Estadio Nacional", -33.4652, -70.6100, 48665, true],
  ["2026-01-17", "Lima", "Peru", "Estadio Nacional", -12.0676, -77.0332, 50086, true],
  ["2026-01-24", "Medellín", "Colombia", "Estadio Atanasio Girardot", 6.2561, -75.5905, 44826, true],
  ["2026-01-25", "Medellín", "Colombia", "Estadio Atanasio Girardot", 6.2561, -75.5905, 44826, true],

  // Future shows (soldOut = false) — after Feb 7, 2026
  ["2026-02-14", "Buenos Aires", "Argentina", "Estadio River Plate", -34.5454, -58.4498, 85000, false],
  ["2026-02-15", "Buenos Aires", "Argentina", "Estadio River Plate", -34.5454, -58.4498, 85000, false],
  ["2026-02-21", "São Paulo", "Brazil", "Allianz Parque", -23.5275, -46.6789, 43713, false],
  ["2026-03-01", "Sydney", "Australia", "ENGIE Stadium", -33.8443, 151.0647, 23500, false],
  ["2026-05-23", "Barcelona", "Spain", "Estadi Olímpic Lluís Companys", 41.3645, 2.1559, 55926, false],
  ["2026-05-27", "Lisbon", "Portugal", "Estádio da Luz", 38.7527, -9.1849, 68100, false],
  ["2026-05-31", "Madrid", "Spain", "Riyadh Air Metropolitano", 40.4361, -3.5994, 70692, false],
  ["2026-06-02", "Madrid", "Spain", "Riyadh Air Metropolitano", 40.4361, -3.5994, 70692, false],
  ["2026-06-03", "Madrid", "Spain", "Riyadh Air Metropolitano", 40.4361, -3.5994, 70692, false],
  ["2026-06-06", "Madrid", "Spain", "Riyadh Air Metropolitano", 40.4361, -3.5994, 70692, false],
  ["2026-06-07", "Madrid", "Spain", "Riyadh Air Metropolitano", 40.4361, -3.5994, 70692, false],
  ["2026-06-10", "Madrid", "Spain", "Riyadh Air Metropolitano", 40.4361, -3.5994, 70692, false],
  ["2026-06-11", "Madrid", "Spain", "Riyadh Air Metropolitano", 40.4361, -3.5994, 70692, false],
  ["2026-06-14", "Madrid", "Spain", "Riyadh Air Metropolitano", 40.4361, -3.5994, 70692, false],
  ["2026-06-15", "Madrid", "Spain", "Riyadh Air Metropolitano", 40.4361, -3.5994, 70692, false],
  ["2026-06-21", "Düsseldorf", "Germany", "Merkur Spiel-Arena", 51.2617, 6.7348, 66500, false],
  ["2026-06-24", "Arnhem", "Netherlands", "GelreDome", 51.9630, 5.8933, 41000, false],
  ["2026-06-28", "London", "United Kingdom", "Tottenham Hotspur Stadium", 51.6043, -0.0662, 62850, false],
  ["2026-07-05", "Paris", "France", "Paris La Défense Arena", 48.8958, 2.2302, 45000, false],
  ["2026-07-11", "Stockholm", "Sweden", "Strawberry Arena", 59.3720, 18.0013, 65000, false],
  ["2026-07-18", "Milan", "Italy", "Ippodromo SNAI La Maura", 45.4930, 9.1269, 80000, false],
];

async function main() {
  console.log(`Inserting ${missingShows.length} missing DTMF shows...`);

  for (const [date, city, country, venue, lat, lng, capacity, soldOut] of missingShows) {
    const id = cuid();
    await client.execute({
      sql: `INSERT INTO concerts (id, tourName, venue, city, country, date, lat, lng, soldOut, capacity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, TOUR, venue, city, country, `${date}T00:00:00.000Z`, lat, lng, soldOut ? 1 : 0, capacity],
    });
  }

  console.log("Done inserting.");

  // Verify total count
  const result = await client.execute(
    `SELECT COUNT(*) as cnt FROM concerts WHERE tourName = '${TOUR}'`
  );
  console.log(`Total DTMF concerts in DB: ${result.rows[0].cnt}`);

  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
