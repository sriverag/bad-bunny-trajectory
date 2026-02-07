import type { Album, Award, TimelineEvent, Concert, AudioFeatures } from "@/types/content";
import type {
  AwardsQuestion,
  AudioDnaQuestion,
  TimelineQuestion,
  WorldTourQuestion,
  QuestionOption,
} from "./game-types";

// Utility: shuffle array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Utility: pick n random items
function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// Utility: generate unique ID
let questionCounter = 0;
function qid(): string {
  return `q-${++questionCounter}-${Date.now()}`;
}

function oid(): string {
  return `o-${++questionCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

// Generate wrong options that are different from the correct one
function generateWrongOptions(
  correct: string,
  pool: string[],
  count: number,
): string[] {
  const filtered = pool.filter((v) => v !== correct);
  return pickRandom(filtered, count);
}

// ─── CEREMONY DISPLAY NAMES ─────────────────────────────────

const CEREMONY_DISPLAY: Record<string, string> = {
  GRAMMY: "Grammy Awards",
  LATIN_GRAMMY: "Latin Grammy Awards",
  BILLBOARD: "Billboard Latin Music Awards",
  MTV: "MTV VMAs",
  AMERICAN_MUSIC: "American Music Awards",
  WWE: "WWE",
  OTHER: "Other",
};

function displayCeremony(raw: string): string {
  return CEREMONY_DISPLAY[raw] ?? raw;
}

// ─── AWARDS QUESTIONS ────────────────────────────────────────

export function generateAwardsQuestions(awards: Award[], count: number): AwardsQuestion[] {
  const wonAwards = awards.filter((a) => a.result === "WON");
  if (wonAwards.length < 4) return [];

  const questions: AwardsQuestion[] = [];
  const ceremonies = [...new Set(awards.map((a) => a.ceremony))];
  const years = [...new Set(awards.map((a) => a.year))].sort();

  // Type 1: Which ceremony for this award?
  const ceremonyPool = pickRandom(wonAwards.filter((a) => ceremonies.length >= 4), Math.ceil(count / 3));
  for (const award of ceremonyPool) {
    const wrong = generateWrongOptions(award.ceremony, ceremonies, 3);
    const options: QuestionOption[] = shuffle([award.ceremony, ...wrong]).map((c) => ({
      id: oid(),
      labelEs: displayCeremony(c),
      labelEn: displayCeremony(c),
      value: c,
    }));
    questions.push({
      mode: "awards",
      id: qid(),
      textEs: `¿En qué ceremonia ganó Bad Bunny "${award.category}"?`,
      textEn: `At which ceremony did Bad Bunny win "${award.category}"?`,
      correctAnswer: award.ceremony,
      options,
      ceremony: award.ceremony,
      awardYear: award.year,
    });
  }

  // Type 2: In what year did they win at ceremony?
  const yearPool = pickRandom(wonAwards.filter((a) => years.length >= 4), Math.ceil(count / 3));
  for (const award of yearPool) {
    const wrong = generateWrongOptions(String(award.year), years.map(String), 3);
    const options: QuestionOption[] = shuffle([String(award.year), ...wrong]).map((y) => ({
      id: oid(),
      labelEs: y,
      labelEn: y,
      value: y,
    }));
    questions.push({
      mode: "awards",
      id: qid(),
      textEs: `¿En qué año ganó Bad Bunny "${award.category}" en los ${displayCeremony(award.ceremony)}?`,
      textEn: `In what year did Bad Bunny win "${award.category}" at the ${displayCeremony(award.ceremony)}?`,
      correctAnswer: String(award.year),
      options,
      ceremony: award.ceremony,
      awardYear: award.year,
    });
  }

  // Type 3: How many awards at ceremony?
  const ceremonyCounts = new Map<string, number>();
  for (const a of wonAwards) {
    ceremonyCounts.set(a.ceremony, (ceremonyCounts.get(a.ceremony) || 0) + 1);
  }
  const countableCeremonies = [...ceremonyCounts.entries()].filter(([, c]) => c > 0);
  const countPool = pickRandom(countableCeremonies, Math.ceil(count / 3));
  for (const [ceremony, correctCount] of countPool) {
    const wrongCounts = [correctCount + 1, correctCount + 3, Math.max(1, correctCount - 2)]
      .filter((c) => c !== correctCount && c > 0);
    const options: QuestionOption[] = shuffle([correctCount, ...wrongCounts.slice(0, 3)]).map((c) => ({
      id: oid(),
      labelEs: String(c),
      labelEn: String(c),
      value: String(c),
    }));
    questions.push({
      mode: "awards",
      id: qid(),
      textEs: `¿Cuántos premios ha ganado Bad Bunny en los ${displayCeremony(ceremony)}?`,
      textEn: `How many awards has Bad Bunny won at the ${displayCeremony(ceremony)}?`,
      correctAnswer: String(correctCount),
      options,
      ceremony,
    });
  }

  return shuffle(questions).slice(0, count);
}

// ─── AUDIO DNA QUESTIONS (Name That Track) ──────────────────

export function generateAudioDnaQuestions(albums: Album[], count: number): AudioDnaQuestion[] {
  // Prefer tracks with preview URLs; fall back to tracks with audio features
  const tracksWithPreview = albums.flatMap((album) =>
    album.tracks
      .filter((t) => t.previewUrl)
      .map((t) => ({ ...t, albumTitle: album.title, albumTheme: album.themeId }))
  );

  const tracksWithFeatures = albums.flatMap((album) =>
    album.tracks
      .filter((t) => t.audioFeatures && !t.previewUrl)
      .map((t) => ({ ...t, albumTitle: album.title, albumTheme: album.themeId }))
  );

  // We need at least 4 unique albums for wrong options
  const allTracks = [...tracksWithPreview, ...tracksWithFeatures];
  const uniqueAlbums = new Set(allTracks.map((t) => t.albumTitle));
  if (allTracks.length < 8 || uniqueAlbums.size < 4) return [];

  const questions: AudioDnaQuestion[] = [];
  const albumTitles = [...uniqueAlbums];

  // Prioritize tracks with preview URLs, then fill with feature-only tracks
  const pool = pickRandom(
    tracksWithPreview.length >= count ? tracksWithPreview : allTracks,
    count + 5, // pick extra in case of duplicates
  );

  for (const track of pool) {
    if (questions.length >= count) break;

    const wrong = generateWrongOptions(track.albumTitle, albumTitles, 3);
    const options: QuestionOption[] = shuffle([track.albumTitle, ...wrong]).map((t) => ({
      id: oid(),
      labelEs: t,
      labelEn: t,
      value: t,
    }));

    questions.push({
      mode: "audio-dna",
      id: qid(),
      textEs: track.previewUrl
        ? "¿A qué álbum pertenece esta canción?"
        : `¿A qué álbum pertenece "${track.title}"?`,
      textEn: track.previewUrl
        ? "Which album does this song belong to?"
        : `Which album does "${track.title}" belong to?`,
      correctAnswer: track.albumTitle,
      options,
      features: track.audioFeatures,
      trackName: track.title,
      previewUrl: track.previewUrl,
    });
  }

  return shuffle(questions).slice(0, count);
}

// ─── TIMELINE QUESTIONS ──────────────────────────────────────

export function generateTimelineQuestions(
  events: TimelineEvent[],
  count: number,
): TimelineQuestion[] {
  if (events.length < 5) return [];

  const questions: TimelineQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const picked = pickRandom(events, 4);
    const sorted = [...picked].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    questions.push({
      mode: "timeline",
      id: qid(),
      events: shuffle(picked),
      correctOrder: sorted.map((e) => e.id),
    });
  }

  return questions;
}

// ─── WORLD TOUR QUESTIONS ────────────────────────────────────

// Generate plausible wrong numeric answers relative to the correct one
function generateWrongNumbers(correct: number, count: number, min: number = 1): number[] {
  const offsets = [-3, -2, -1, 1, 2, 3, 4, 5, -4, -5];
  const candidates = offsets
    .map((o) => correct + o)
    .filter((n) => n >= min && n !== correct);
  // Dedupe and pick
  const unique = [...new Set(candidates)];
  return pickRandom(unique, count);
}

// Generate plausible wrong numbers for large values (capacities).
// Offsets scale with magnitude so formatted labels (K/M) are always distinct.
function generateWrongCapacities(correct: number, count: number): number[] {
  const rounded = Math.round(correct / 1000) * 1000;
  const correctLabel = formatCapacity(rounded);

  // Scale step size so each offset produces a different formatted label
  // For >= 1M values, formatCapacity uses .toFixed(1)M → need ≥100K steps
  // For < 1M values, formatCapacity uses K → need ≥1K steps
  const step = rounded >= 1000000 ? 100000 : rounded >= 100000 ? 10000 : 5000;
  const multipliers = [-4, -3, -2, -1, 1, 2, 3, 4, 5, 6];

  const candidates = multipliers
    .map((m) => rounded + m * step)
    .filter((n) => n > 0 && formatCapacity(n) !== correctLabel);

  // Dedupe by formatted label so no two options look the same
  const seen = new Set<string>();
  const unique: number[] = [];
  for (const n of candidates) {
    const label = formatCapacity(n);
    if (!seen.has(label)) {
      seen.add(label);
      unique.push(n);
    }
  }
  return pickRandom(unique, count);
}

function formatCapacity(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000).toLocaleString()}K`;
  return String(n);
}

export function generateWorldTourQuestions(concerts: Concert[], count: number): WorldTourQuestion[] {
  if (concerts.length < 8) return [];

  const questions: WorldTourQuestion[] = [];
  const tours = [...new Set(concerts.map((c) => c.tourName))];

  // Filter to past concerts only for computing stats
  const now = new Date();
  const pastConcerts = concerts.filter((c) => new Date(c.date) <= now);

  // Pre-compute per-tour stats using only past concerts
  const tourStats = new Map<string, {
    shows: number;
    countries: string[];
    countryCount: number;
    soldOutCount: number;
    totalCapacity: number;
    year: number;
  }>();

  for (const tour of tours) {
    const tourPastConcerts = pastConcerts.filter((c) => c.tourName === tour);
    if (tourPastConcerts.length === 0) continue; // skip tours with no past shows
    const tourCountries = [...new Set(tourPastConcerts.map((c) => c.country))];
    const soldOut = tourPastConcerts.filter((c) => c.soldOut).length;
    const totalCap = tourPastConcerts.reduce((sum, c) => sum + (c.capacity ?? 0), 0);
    const year = new Date(tourPastConcerts[0].date).getFullYear();
    tourStats.set(tour, {
      shows: tourPastConcerts.length,
      countries: tourCountries,
      countryCount: tourCountries.length,
      soldOutCount: soldOut,
      totalCapacity: totalCap,
      year,
    });
  }

  // Detect in-progress tours (have both past and future shows)
  const futureTourNames = new Set(
    concerts.filter((c) => new Date(c.date) > now).map((c) => c.tourName)
  );
  const inProgressTours = new Set(
    tours.filter((t) => tourStats.has(t) && futureTourNames.has(t))
  );

  // Use all concerts for country pool (wrong options), but pastConcerts for stats
  const allCountries = [...new Set(concerts.map((c) => c.country))];
  const allYears = [...new Set([...tourStats.values()].map((s) => s.year))];

  // Only generate questions for tours that have stats (past shows)
  const toursWithStats = tours.filter((t) => tourStats.has(t));

  // Type 1: Tour show count
  for (const tour of pickRandom(toursWithStats, 2)) {
    const stats = tourStats.get(tour)!;
    const ip = inProgressTours.has(tour);
    const wrong = generateWrongNumbers(stats.shows, 3);
    const options: QuestionOption[] = shuffle([stats.shows, ...wrong]).map((n) => ({
      id: oid(),
      labelEs: String(n),
      labelEn: String(n),
      value: String(n),
    }));
    const tourConcerts = pastConcerts.filter((c) => c.tourName === tour);
    questions.push({
      mode: "world-tour",
      id: qid(),
      textEs: ip
        ? `¿Cuántos shows ha tenido el ${tour} hasta ahora?`
        : `¿Cuántos shows tuvo el ${tour}?`,
      textEn: ip
        ? `How many shows has the ${tour} had so far?`
        : `How many shows did the ${tour} have?`,
      correctAnswer: String(stats.shows),
      options,
      highlightCoords: tourConcerts.map((c) => ({ lat: c.lat, lng: c.lng })),
    });
  }

  // Type 2: Tour country reach
  for (const tour of pickRandom(toursWithStats, 2)) {
    const stats = tourStats.get(tour)!;
    const ip = inProgressTours.has(tour);
    const wrong = generateWrongNumbers(stats.countryCount, 3);
    const options: QuestionOption[] = shuffle([stats.countryCount, ...wrong]).map((n) => ({
      id: oid(),
      labelEs: String(n),
      labelEn: String(n),
      value: String(n),
    }));
    const tourConcertsForCountry = pastConcerts.filter((c) => c.tourName === tour);
    questions.push({
      mode: "world-tour",
      id: qid(),
      textEs: ip
        ? `¿Cuántos países ha visitado el ${tour} hasta ahora?`
        : `¿Cuántos países visitó el ${tour}?`,
      textEn: ip
        ? `How many countries has the ${tour} visited so far?`
        : `How many countries did the ${tour} visit?`,
      correctAnswer: String(stats.countryCount),
      options,
      highlightCoords: tourConcertsForCountry.map((c) => ({ lat: c.lat, lng: c.lng })),
    });
  }

  // Type 3: Which tour visited country
  if (toursWithStats.length >= 4) {
    const countriesWithTours = allCountries.map((country) => ({
      country,
      tours: toursWithStats.filter((t) =>
        tourStats.get(t)!.countries.includes(country)
      ),
    })).filter((c) => c.tours.length > 0 && c.tours.length < toursWithStats.length);

    for (const item of pickRandom(countriesWithTours, 2)) {
      const correctTour = pickRandom(item.tours, 1)[0];
      const wrong = generateWrongOptions(correctTour, toursWithStats, 3);
      const options: QuestionOption[] = shuffle([correctTour, ...wrong]).map((t) => ({
        id: oid(),
        labelEs: t,
        labelEn: t,
        value: t,
      }));
      const countryConcerts = pastConcerts.filter(
        (c) => c.country === item.country && c.tourName === correctTour
      );
      questions.push({
        mode: "world-tour",
        id: qid(),
        textEs: `¿Cuál tour tuvo shows en ${item.country}?`,
        textEn: `Which tour performed in ${item.country}?`,
        correctAnswer: correctTour,
        options,
        highlightCoords: countryConcerts.map((c) => ({ lat: c.lat, lng: c.lng })),
      });
    }
  }

  // Type 4: Tour NOT in country
  if (toursWithStats.length >= 2 && allCountries.length >= 4) {
    for (const tour of pickRandom(toursWithStats, 2)) {
      const stats = tourStats.get(tour)!;
      const ip = inProgressTours.has(tour);
      const visitedSet = new Set(stats.countries);
      const notVisited = allCountries.filter((c) => !visitedSet.has(c));
      if (notVisited.length === 0) continue;
      const correctCountry = pickRandom(notVisited, 1)[0];
      // Wrong options = countries the tour DID visit
      const wrong = pickRandom(stats.countries, Math.min(3, stats.countries.length));
      if (wrong.length < 3) continue;
      const options: QuestionOption[] = shuffle([correctCountry, ...wrong]).map((c) => ({
        id: oid(),
        labelEs: c,
        labelEn: c,
        value: c,
      }));
      questions.push({
        mode: "world-tour",
        id: qid(),
        textEs: ip
          ? `¿En cuál país NO se ha presentado el ${tour} hasta ahora?`
          : `¿En cuál país NO se presentó el ${tour}?`,
        textEn: ip
          ? `Which country has the ${tour} NOT visited yet?`
          : `Which country did the ${tour} NOT visit?`,
        correctAnswer: correctCountry,
        options,
      });
    }
  }

  // Type 5: Sold-out count
  const toursWithSoldOut = toursWithStats.filter((t) => tourStats.get(t)!.soldOutCount > 0);
  for (const tour of pickRandom(toursWithSoldOut.length >= 2 ? toursWithSoldOut : toursWithStats, 2)) {
    const stats = tourStats.get(tour)!;
    const ip = inProgressTours.has(tour);
    const wrong = generateWrongNumbers(stats.soldOutCount, 3, 0);
    const options: QuestionOption[] = shuffle([stats.soldOutCount, ...wrong]).map((n) => ({
      id: oid(),
      labelEs: String(n),
      labelEn: String(n),
      value: String(n),
    }));
    questions.push({
      mode: "world-tour",
      id: qid(),
      textEs: ip
        ? `¿Cuántos shows sold-out ha tenido el ${tour} hasta ahora?`
        : `¿Cuántos shows sold-out tuvo el ${tour}?`,
      textEn: ip
        ? `How many sold-out shows has the ${tour} had so far?`
        : `How many sold-out shows did the ${tour} have?`,
      correctAnswer: String(stats.soldOutCount),
      options,
    });
  }

  // Type 6: Tour year
  if (allYears.length >= 4) {
    for (const tour of pickRandom(toursWithStats, 2)) {
      const stats = tourStats.get(tour)!;
      const ip = inProgressTours.has(tour);
      const wrong = generateWrongNumbers(stats.year, 3, 2017);
      const options: QuestionOption[] = shuffle([stats.year, ...wrong]).map((y) => ({
        id: oid(),
        labelEs: String(y),
        labelEn: String(y),
        value: String(y),
      }));
      questions.push({
        mode: "world-tour",
        id: qid(),
        textEs: ip
          ? `¿En qué año comenzó el ${tour}?`
          : `¿En qué año se realizó el ${tour}?`,
        textEn: ip
          ? `In what year did the ${tour} start?`
          : `In what year did the ${tour} take place?`,
        correctAnswer: String(stats.year),
        options,
      });
    }
  }

  // Type 7: Total capacity
  const toursWithCapacity = toursWithStats.filter((t) => tourStats.get(t)!.totalCapacity > 0);
  if (toursWithCapacity.length >= 1) {
    for (const tour of pickRandom(toursWithCapacity, 2)) {
      const stats = tourStats.get(tour)!;
      const ip = inProgressTours.has(tour);
      const rounded = Math.round(stats.totalCapacity / 1000) * 1000;
      const wrong = generateWrongCapacities(stats.totalCapacity, 3);
      if (wrong.length < 3) continue; // skip if not enough distinct options
      const options: QuestionOption[] = shuffle([rounded, ...wrong]).map((n) => ({
        id: oid(),
        labelEs: formatCapacity(n),
        labelEn: formatCapacity(n),
        value: String(n),
      }));
      questions.push({
        mode: "world-tour",
        id: qid(),
        textEs: ip
          ? `¿Cuántos fans han asistido al ${tour} hasta ahora?`
          : `¿Cuántos fans asistieron al ${tour} en total?`,
        textEn: ip
          ? `How many total fans have attended the ${tour} so far?`
          : `How many total fans attended the ${tour}?`,
        correctAnswer: String(rounded),
        options,
      });
    }
  }

  return shuffle(questions).slice(0, count);
}
