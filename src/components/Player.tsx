import React from "react";

import styles from "../css/Player.module.css";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  nowPlaying as nowPlayingState,
  shuffle as shuffleState,
  loop as loopState,
  openPlaylist as openPlaylistState,
  fullscreen as fullscreenState,
  paused as pausedState,
  currentTime as currentTimeState,
  volume as volumeState,
} from "../recoil";

import {
  PlayIcon,
  PauseIcon,
  PreviousIcon,
  ForwardIcon,
  ShuffleIcon,
  LoopIcon,
  LoopOneIcon,
  PlaylistIcon,
  VolumeMaxIcon,
  VolumeMediumIcon,
  VolumeMinIcon,
  VolumeMuteIcon,
  FullScreenIcon,
} from "./icons";

import { trackDurationToReadable, timeToReadable } from "../utils";
import { ELoopType } from "../types";

export default function Player() {
  const nowPlaying = useRecoilValue(nowPlayingState);

  const [paused, setPaused] = useRecoilState(pausedState);
  const [currentTime, setCurrentTime] = useRecoilState(currentTimeState);
  const [volume, setVolume] = useRecoilState(volumeState);

  const [shuffle, setShuffle] = useRecoilState(shuffleState);
  const [loop, setLoop] = useRecoilState(loopState);
  const [openPlaylist, setOpenPlaylist] = useRecoilState(openPlaylistState);
  const [fullscreen, setFullscreen] = useRecoilState(fullscreenState);

  const [beforeVolume, setBeforeVolume] = React.useState<number>(1);

  const volumeButton = () => {
    setBeforeVolume(volume);
    setVolume(volume ? 0 : beforeVolume);
  };

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
              <div
                className={styles.iconContainer}
                onClick={() => setShuffle(!shuffle)}
              >
                <ShuffleIcon
                  className={`${styles.icon} ${styles.sideButton} ${
                    shuffle && styles.enableColor
                  }`}
                />
              </div>

              <PreviousIcon className={`${styles.icon} ${styles.sideButton}`} />

              <button
                className={styles.playButton}
                onClick={() => setPaused(!paused)}
              >
                {!paused ? (
                  <PlayIcon className={styles.playButtonIcon} />
                ) : (
                  <PauseIcon className={styles.playButtonIcon} />
                )}
              </button>

              <ForwardIcon className={`${styles.icon} ${styles.sideButton}`} />

              <div
                className={styles.iconContainer}
                onClick={() => {
                  if (loop === ELoopType.None) setLoop(ELoopType.All);
                  else if (loop === ELoopType.All) setLoop(ELoopType.One);
                  else if (loop === ELoopType.One) setLoop(ELoopType.None);
                }}
              >
                {loop === ELoopType.One ? (
                  <LoopOneIcon
                    className={`${styles.icon} ${styles.sideButton} ${styles.enableColor}`}
                  />
                ) : (
                  <LoopIcon
                    className={`${styles.icon} ${styles.sideButton} ${
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
                onChange={(e) =>
                  setCurrentTime(
                    nowPlaying.track.start + Number(e.target.value)
                  )
                }
              />

              <span className={styles.barText}>
                {trackDurationToReadable(nowPlaying.track)}
              </span>
            </div>
          </div>

          <div className={`${styles.barItem} ${styles.controls}`}>
            <div
              onClick={() => setOpenPlaylist(!openPlaylist)}
              className={styles.iconContainer}
            >
              <PlaylistIcon
                className={`${styles.icon} ${
                  openPlaylist && styles.enableColor
                }`}
              />
            </div>

            <div onClick={volumeButton} className={styles.iconContainer}>
              {volume === 0 ? (
                <VolumeMuteIcon
                  className={`${styles.icon} ${styles.volumeButton}`}
                />
              ) : volume < 0.25 ? (
                <VolumeMinIcon
                  className={`${styles.icon} ${styles.volumeButton}`}
                />
              ) : volume < 0.5 ? (
                <VolumeMediumIcon
                  className={`${styles.icon} ${styles.volumeButton}`}
                />
              ) : (
                <VolumeMaxIcon
                  className={`${styles.icon} ${styles.volumeButton}`}
                />
              )}
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume * 100}
              className={styles.progressSlider}
              style={
                {
                  width: "95px",
                  "--progress": `${(volume ?? 1) * 100}%`,
                  "--defaultColor": "#a7a7a7",
                } as React.CSSProperties
              }
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
            />

            <div
              style={{ marginLeft: 5 }}
              onClick={() => setFullscreen(!fullscreen)}
            >
              <FullScreenIcon className={styles.icon} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
