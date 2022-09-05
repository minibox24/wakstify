import React from "react";

import Hls, { FragmentLoaderContext, HlsConfig } from "hls.js";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  nowPlaying as nowPlayingState,
  paused as pausedState,
  currentTime as currentTimeState,
  volume as volumeState,
  shuffle as shuffleState,
  loop as loopState,
  fullscreen as fullscreenState,
} from "../recoil";

import {
  CafeIcon,
  PlayIcon,
  PauseIcon,
  PreviousIcon,
  ForwardIcon,
  ShuffleIcon,
  LoopIcon,
  LoopOneIcon,
  VolumeMaxIcon,
  VolumeMediumIcon,
  VolumeMinIcon,
  VolumeMuteIcon,
  FullScreenExitIcon,
  YoutubeIcon,
} from "./icons";

import { ELoopType } from "../types";
import { trackDurationToReadable, timeToReadable } from "../utils";

import styles from "../css/FullScreen.module.css";

export default function FullScreen() {
  const hls = React.useMemo(
    () =>
      new Hls({
        // @ts-ignore TODO: 뇌가 아픈 타입스크립트
        fLoader: class extends Hls.DefaultConfig.loader {
          constructor(config: HlsConfig) {
            super(config);

            const load = this.load.bind(this);

            this.load = (context: FragmentLoaderContext, config, callbacks) => {
              const key = context.frag.baseurl.split("?")[1];

              context.url += `?${key}`;

              load(context, config, callbacks);
            };
          }
        },
      }),
    []
  );

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [nowPlaying, setNowPlaying] = useRecoilState(nowPlayingState);

  const [paused, setPaused] = useRecoilState(pausedState);
  const [currentTime, setCurrentTime] = useRecoilState(currentTimeState);
  const [volume, setVolume] = useRecoilState(volumeState);

  const [shuffle, setShuffle] = useRecoilState(shuffleState);
  const [loop, setLoop] = useRecoilState(loopState);
  const [fullscreen, setFullscreen] = useRecoilState(fullscreenState);

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
  }, [nowPlaying, setNowPlaying, setCurrentTime]);

  React.useEffect(() => {
    const video = videoRef.current;

    if (video) {
      hls.attachMedia(video);

      video.addEventListener("timeupdate", timeUpdate);

      return () => {
        video.removeEventListener("timeupdate", timeUpdate);
      };
    }
  }, [timeUpdate, hls]);

  React.useEffect(() => {
    if (nowPlaying && videoRef.current) {
      hls.loadSource(nowPlaying.source.url + nowPlaying.source.key);
      videoRef.current.currentTime = nowPlaying.track.start;
      videoRef.current.play();
    }
  }, [nowPlaying, hls]);

  return (
    <div className={`${styles.fullscreen} ${!fullscreen && styles.minimized}`}>
      <div className={styles.background}>
        <img
          alt="bg"
          src="https://media.discordapp.net/attachments/872107972665413642/1016321257052057690/unknown.png"
          // src={`https://img.youtube.com/vi/${nowPlaying?.track.youtube}/maxresdefault.jpg`}
        />
        <div />
      </div>

      <video ref={videoRef} className={styles.video} />

      {nowPlaying && (
        <div className={styles.control}>
          <div className={styles.info}>
            <img
              alt="cover"
              className={styles.cover}
              src={`https://img.youtube.com/vi/${nowPlaying?.track.youtube}/maxresdefault.jpg`}
            />
            <div className={styles.infoText}>
              <span className={styles.title}>{nowPlaying?.track.title}</span>
              <span className={styles.artist}>
                {nowPlaying?.track.artist} ({nowPlaying?.track.cover})
              </span>
            </div>
          </div>

          <div className={styles.progressBar}>
            <span className={styles.barText}>
              {timeToReadable(currentTime - nowPlaying?.track.start)}
            </span>

            <input
              type="range"
              min={0}
              max={nowPlaying?.track.end - nowPlaying?.track.start}
              value={currentTime - nowPlaying?.track.start}
              className={styles.progressSlider}
              style={
                {
                  "--progress": `${
                    ((currentTime - nowPlaying?.track.start) /
                      (nowPlaying?.track.end - nowPlaying?.track.start)) *
                    100
                  }%`,
                } as React.CSSProperties
              }
              onChange={(e) =>
                setCurrentTime(nowPlaying?.track.start + Number(e.target.value))
              }
            />

            <span className={styles.barText}>
              {trackDurationToReadable(nowPlaying?.track)}
            </span>
          </div>

          <div className={styles.controlButtons}>
            <div className={`${styles.barItem} ${styles.links}`}>
              <YoutubeIcon className={`${styles.icon} ${styles.linkIcon}`} />
              <CafeIcon className={`${styles.icon} ${styles.linkIcon}`} />
            </div>

            <div className={`${styles.barItem} ${styles.centerButtons}`}>
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

            <div
              className={styles.barItem}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <div className={styles.iconContainer}>
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
                    maxWidth: "120px",
                    marginRight: "10px",
                    "--progress": `${(volume ?? 1) * 100}%`,
                    "--defaultColor": "#a7a7a7",
                  } as React.CSSProperties
                }
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
              />{" "}
              <div
                className={styles.iconContainer}
                onClick={() => setFullscreen(!fullscreen)}
              >
                <FullScreenExitIcon className={styles.icon} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
