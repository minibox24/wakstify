import React from "react";

import styles from "../css/Player.module.css";

import { useRecoilState } from "recoil";
import {
  nowPlaying as nowPlayingState,
  shuffle as shuffleState,
  loop as loopState,
} from "../recoil";

import {
  // PlayIcon,
  // PauseIcon,
  // BackwardIcon,
  // ForwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";

import {
  PlayIcon,
  PauseIcon,
  PreviousIcon,
  ForwardIcon,
  ShuffleIcon,
  LoopIcon,
  LoopOneIcon,
} from "./icons";

import { trackDurationToReadable, timeToReadable } from "../utils";
import { ELoopType } from "../types";

export default function Player() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = React.useState<number>(0);

  const [nowPlaying, setNowPlaying] = useRecoilState(nowPlayingState);
  const [shuffle, setShuffle] = useRecoilState(shuffleState);
  const [loop, setLoop] = useRecoilState(loopState);

  const [beforeVolume, setBeforeVolume] = React.useState<number>(1);

  const timeUpdate = React.useCallback(() => {
    if (nowPlaying && videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      const duration = nowPlaying.track.end - nowPlaying.track.start;
      const now = videoRef.current.currentTime - nowPlaying.track.start;

      if (now >= duration) {
        setNowPlaying(null);
        videoRef.current.pause();
      }
    }
  }, [nowPlaying, setNowPlaying]);

  const volumeButton = () => {
    if (videoRef.current) {
      setBeforeVolume(videoRef.current.volume);
      videoRef.current.volume = videoRef.current.volume ? 0 : beforeVolume;
    }
  };

  React.useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.addEventListener("timeupdate", timeUpdate);

      return () => {
        video.removeEventListener("timeupdate", timeUpdate);
      };
    }
  }, [timeUpdate]);

  React.useEffect(() => {
    if (nowPlaying && videoRef.current) {
      videoRef.current.src = nowPlaying.url;
      videoRef.current.currentTime = nowPlaying.track.start;
      videoRef.current.play();
    }
  }, [nowPlaying]);

  return (
    <div className={styles.player}>
      {nowPlaying && (
        <div className={styles.playerBar}>
          <div className={`${styles.barItem} ${styles.info}`}>
            <img
              alt="cover"
              className={styles.coverImage}
              src={`https://img.youtube.com/vi/${nowPlaying.track.youtube}/maxresdefault.jpg`}
            />
            <div className={styles.textInfo}>
              <span className={styles.title}>{nowPlaying.track.title}</span>
              <span className={styles.artist}>
                {nowPlaying.track.artist} ({nowPlaying.track.cover})
              </span>
            </div>
          </div>

          <div className={`${styles.barItem} ${styles.progress}`}>
            <div className={styles.progressControl}>
              <div onClick={() => setShuffle(!shuffle)}>
                <ShuffleIcon
                  className={`${styles.sideButton} ${
                    shuffle && styles.enableColor
                  }`}
                />
              </div>

              <PreviousIcon className={styles.sideButton} />

              <button
                className={styles.playButton}
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.paused) videoRef.current.play();
                    else videoRef.current.pause();
                  }
                }}
              >
                {videoRef.current && videoRef.current.paused ? (
                  <PlayIcon className={styles.playButtonIcon} />
                ) : (
                  <PauseIcon className={styles.playButtonIcon} />
                )}
              </button>

              <ForwardIcon className={styles.sideButton} />

              <div
                onClick={() => {
                  if (loop === ELoopType.None) setLoop(ELoopType.All);
                  else if (loop === ELoopType.All) setLoop(ELoopType.One);
                  else if (loop === ELoopType.One) setLoop(ELoopType.None);
                }}
              >
                {loop === ELoopType.One ? (
                  <LoopOneIcon
                    className={`${styles.sideButton} ${styles.enableColor}`}
                  />
                ) : (
                  <LoopIcon
                    className={`${styles.sideButton} ${
                      loop === ELoopType.All && styles.enableColor
                    }`}
                  />
                )}
              </div>
            </div>

            <div className={styles.progressBar}>
              <span className={styles.barText}>
                {timeToReadable(currentTime - nowPlaying.track.start)}
              </span>

              <input
                type="range"
                min={0}
                max={nowPlaying.track.end - nowPlaying.track.start}
                value={currentTime - nowPlaying.track.start}
                className={styles.progressSlider}
                style={
                  {
                    width: "80%",
                    "--progress": `${
                      ((currentTime - nowPlaying.track.start) /
                        (nowPlaying.track.end - nowPlaying.track.start)) *
                      100
                    }%`,
                  } as React.CSSProperties
                }
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime =
                      nowPlaying.track.start + Number(e.target.value);
                  }
                }}
              />

              <span className={styles.barText}>
                {trackDurationToReadable(nowPlaying.track)}
              </span>
            </div>
          </div>

          <div className={`${styles.barItem} ${styles.controls}`}>
            {videoRef.current && videoRef.current.volume ? (
              <SpeakerWaveIcon
                className={styles.volumeButton}
                onClick={volumeButton}
              />
            ) : (
              <SpeakerXMarkIcon
                className={styles.volumeButton}
                onClick={volumeButton}
              />
            )}

            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={(videoRef.current?.volume ?? 1) * 100}
              className={styles.progressSlider}
              style={
                {
                  "--progress": `${(videoRef.current?.volume ?? 1) * 100}%`,
                  "--defaultColor": "#a7a7a7",
                } as React.CSSProperties
              }
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.volume = Number(e.target.value) / 100;
                }
              }}
            />
          </div>
        </div>
      )}

      <video ref={videoRef} width="800px" autoPlay controls />
    </div>
  );
}
