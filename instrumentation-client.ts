import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (typeof window !== "undefined" && key) {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2025-11-30",
    person_profiles: "always",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}
