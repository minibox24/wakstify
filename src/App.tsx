import React from "react";
import Track from "./components/Track";
import Playlist from "./components/Playlist";
import FullScreen from "./components/FullScreen";
import Player from "./components/Player";

import { useRecoilValue } from "recoil";
import {
  openPlaylist as openPlaylistState,
  fullscreen as fullscreenState,
} from "./recoil";

import { ITrack } from "./types";

export default function App() {
  const [tracks, setTracks] = React.useState<ITrack[]>([]);
  const openPlaylist = useRecoilValue(openPlaylistState);
  const fullscreen = useRecoilValue(fullscreenState);

  React.useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/tracks");
      const data = await response.json();

      setTracks(data);
    })();
  }, []);

  return (
    <div className="App">
      <div style={{ height: "calc(100vh - 80px)", overflowY: "scroll" }}>
        <h1>임시 전체 노래 목록</h1>
        <div
          style={{
            width: "1000px",
            height: "500px",
            overflowY: "scroll",
            border: "1px solid white",
          }}
        >
          {tracks.map((track, index) => (
            <Track track={track} key={index} />
          ))}
        </div>
      </div>

      {openPlaylist && <Playlist />}

      <FullScreen />
      <Player />
    </div>
  );
}
