import { getInterviews } from "./content";

/**
 * YouTube service – currently returns data from the database.
 * When YOUTUBE_API_KEY is set, this module will fetch from the YouTube Data API.
 */

const isLive = () => !!process.env.YOUTUBE_API_KEY;

export async function searchVideos(query: string) {
  if (isLive()) {
    // TODO: Implement YouTube Data API call – GET /youtube/v3/search
  }

  // Fall back to DB interviews, optionally filtered by the query string
  const result = await getInterviews({ tag: query });
  return result.data;
}

export async function getVideoDetails(videoId: string) {
  if (isLive()) {
    // TODO: Implement YouTube Data API call – GET /youtube/v3/videos
  }

  // Stub – return minimal shape
  return {
    id: videoId,
    title: "",
    description: "",
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}
