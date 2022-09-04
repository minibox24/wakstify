import React from "react";

import styles from "../css/Player.module.css";

import { useRecoilState } from "recoil";
import {
  nowPlaying as nowPlayingState,
  shuffle as shuffleState,
  loop as loopState,
  openPlaylist as openPlaylistState,
  fullscreen as fullscreenState,
} from "../recoil";

import Hls, { FragmentLoaderContext, HlsConfig } from "hls.js";

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
  const [currentTime, setCurrentTime] = React.useState<number>(0);

  const [nowPlaying, setNowPlaying] = useRecoilState(nowPlayingState);
  const [shuffle, setShuffle] = useRecoilState(shuffleState);
  const [loop, setLoop] = useRecoilState(loopState);
  const [openPlaylist, setOpenPlaylist] = useRecoilState(openPlaylistState);
  const [fullscreen, setFullscreen] = useRecoilState(fullscreenState);

  const [volume, setVolume] = React.useState<number>(1);
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
      setVolume(videoRef.current.volume ? 0 : beforeVolume);
    }
  };

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

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

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
                  className={`${styles.icon} ${styles.sideButton} ${
                    shuffle && styles.enableColor
                  }`}
                />
              </div>

              <PreviousIcon className={`${styles.icon} ${styles.sideButton}`} />

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

              <ForwardIcon className={`${styles.icon} ${styles.sideButton}`} />

              <div
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
            <div onClick={() => setOpenPlaylist(!openPlaylist)}>
              <PlaylistIcon
                className={`${styles.icon} ${
                  openPlaylist && styles.enableColor
                }`}
              />
            </div>

            <div onClick={volumeButton}>
              {videoRef.current && videoRef.current.volume === 0 ? (
                <VolumeMuteIcon
                  className={`${styles.icon} ${styles.volumeButton}`}
                />
              ) : videoRef.current && videoRef.current.volume < 0.25 ? (
                <VolumeMinIcon
                  className={`${styles.icon} ${styles.volumeButton}`}
                />
              ) : videoRef.current && videoRef.current.volume < 0.5 ? (
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
                  width: "30%",
                  "--progress": `${(videoRef.current?.volume ?? 1) * 100}%`,
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

      <video ref={videoRef} width="400px" autoPlay controls />
    </div>
  );
}
