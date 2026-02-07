import { Composition } from "remotion";
import {
  AnnouncementVideo,
  TOTAL_DURATION,
} from "./compositions/AnnouncementVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AnnouncementVideo"
      component={AnnouncementVideo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1080}
      height={1080}
    />
  );
};
