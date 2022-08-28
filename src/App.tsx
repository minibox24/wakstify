import React from "react";
import Track from "./components/Track";
import Player from "./components/Player";

import { ITrack } from "./types";

export default function App() {
  const [tracks, setTracks] = React.useState<ITrack[]>([]);

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
        {tracks.map((track, index) => (
          <Track track={track} key={index} />
        ))}
      </div>

      <Player />
    </div>
  );
}
