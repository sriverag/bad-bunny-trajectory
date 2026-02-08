import { interpolate, staticFile, AbsoluteFill } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { IntroScene } from "../scenes/IntroScene";
import { AlbumShowcase } from "../scenes/AlbumShowcase";
import { FeatureDiscography } from "../scenes/FeatureDiscography";
import { FeaturePlayer } from "../scenes/FeaturePlayer";
import { TrajectoryScene } from "../scenes/TrajectoryScene";
import { ConcertsScene } from "../scenes/ConcertsScene";
import { DiscographyScene } from "../scenes/DiscographyScene";
import { InterviewsScene } from "../scenes/InterviewsScene";
import { TriviaScene } from "../scenes/TriviaScene";
import { SetlistScene } from "../scenes/SetlistScene";
import { SuperBowlScene } from "../scenes/SuperBowlScene";
import { OutroScene } from "../scenes/OutroScene";

const FPS = 30;
const TRANSITION_DURATION = 15; // frames

// Scene durations in frames
const INTRO_DURATION = 3 * FPS; // 90
const ALBUM_DURATION = 4 * FPS; // 120
const DISCOGRAPHY_FEATURE_DURATION = 3 * FPS; // 90
const PLAYER_DURATION = 3 * FPS; // 90
const TRAJECTORY_DURATION = Math.round(3.5 * FPS); // 105
const CONCERTS_DURATION = Math.round(3.5 * FPS); // 105
const DISCOGRAPHY_DETAIL_DURATION = Math.round(3.5 * FPS); // 105
const INTERVIEWS_DURATION = Math.round(3.5 * FPS); // 105
const TRIVIA_DURATION = Math.round(3.5 * FPS); // 105
const SETLIST_DURATION = Math.round(3.5 * FPS); // 105
const SUPERBOWL_DURATION = Math.round(3.5 * FPS); // 105
const OUTRO_DURATION = Math.round(3.5 * FPS); // 105

const SCENE_COUNT = 12;
const TRANSITION_COUNT = SCENE_COUNT - 1; // 11

export const TOTAL_DURATION =
  INTRO_DURATION +
  ALBUM_DURATION +
  DISCOGRAPHY_FEATURE_DURATION +
  PLAYER_DURATION +
  TRAJECTORY_DURATION +
  CONCERTS_DURATION +
  DISCOGRAPHY_DETAIL_DURATION +
  INTERVIEWS_DURATION +
  TRIVIA_DURATION +
  SETLIST_DURATION +
  SUPERBOWL_DURATION +
  OUTRO_DURATION -
  TRANSITION_COUNT * TRANSITION_DURATION;

export const AnnouncementVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music - plays throughout the entire video */}
      <Audio
        src={staticFile("audio/dtmf-excerpt.mp3")}
        volume={(f) => {
          const fadeInEnd = 2 * FPS;
          const fadeOutStart = TOTAL_DURATION - 3 * FPS;
          // Fade in over 2s, hold at 0.7, fade out over last 3s
          if (f < fadeInEnd) {
            return interpolate(f, [0, fadeInEnd], [0, 0.7], {
              extrapolateRight: "clamp",
            });
          }
          if (f > fadeOutStart) {
            return interpolate(f, [fadeOutStart, TOTAL_DURATION], [0.7, 0], {
              extrapolateRight: "clamp",
            });
          }
          return 0.7;
        }}
      />
    <TransitionSeries>
      {/* 1. Intro */}
      <TransitionSeries.Sequence durationInFrames={INTRO_DURATION}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 2. Album Showcase */}
      <TransitionSeries.Sequence durationInFrames={ALBUM_DURATION}>
        <AlbumShowcase />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 3. 6 Albums 6 Themes */}
      <TransitionSeries.Sequence durationInFrames={DISCOGRAPHY_FEATURE_DURATION}>
        <FeatureDiscography />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 4. Music Player */}
      <TransitionSeries.Sequence durationInFrames={PLAYER_DURATION}>
        <FeaturePlayer />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 5. Trajectory & Timeline */}
      <TransitionSeries.Sequence durationInFrames={TRAJECTORY_DURATION}>
        <TrajectoryScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 6. Concerts & Tours */}
      <TransitionSeries.Sequence durationInFrames={CONCERTS_DURATION}>
        <ConcertsScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 7. Discography with Previews */}
      <TransitionSeries.Sequence durationInFrames={DISCOGRAPHY_DETAIL_DURATION}>
        <DiscographyScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 8. Interviews */}
      <TransitionSeries.Sequence durationInFrames={INTERVIEWS_DURATION}>
        <InterviewsScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 9. Trivia Games */}
      <TransitionSeries.Sequence durationInFrames={TRIVIA_DURATION}>
        <TriviaScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 10. Setlist Prediction */}
      <TransitionSeries.Sequence durationInFrames={SETLIST_DURATION}>
        <SetlistScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 11. Super Bowl Callout */}
      <TransitionSeries.Sequence durationInFrames={SUPERBOWL_DURATION}>
        <SuperBowlScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* 12. Outro/CTA */}
      <TransitionSeries.Sequence durationInFrames={OUTRO_DURATION}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    </AbsoluteFill>
  );
};
