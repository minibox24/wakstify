import { ITrack } from "../types";
import styles from "../css/Track.module.css";

import { useSetRecoilState } from "recoil";
import nowPlayingState from "../recoil/nowPlaying";

import { convertDate, trackDurationToReadable } from "../utils";

interface ITrackProps {
  track: ITrack;
}

export default function Track({ track }: ITrackProps) {
  const setNowPlaying = useSetRecoilState(nowPlayingState);

  const playTrack = async () => {
    const response = await fetch(`http://localhost:8000/tracks/${track.id}`);
    const data = await response.json();

    setNowPlaying(data);
  };

  return (
    <div className={styles.track} onClick={playTrack}>
      <div style={{ display: "flex" }}>
        <img
          alt="cover"
          src={`https://img.youtube.com/vi/${track.youtube}/maxresdefault.jpg`}
          className={styles.coverImage}
        />

        <div className={styles.infoBox}>
          <span className={styles.title}>{track.title}</span>
          <span className={styles.artist}>{track.artist}</span>
        </div>
      </div>

      <div className={styles.textBox}>
        <span>{track.cover}</span>
      </div>

      <div className={styles.textBox}>
        <span>{convertDate(track.date)}</span>
      </div>

      <div className={styles.textBox}>
        <span>{trackDurationToReadable(track)}</span>
      </div>
    </div>
  );
}
