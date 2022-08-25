import React from "react";

interface Track {
  id: string;
  date: string;
  start: number;
  end: number;

  artist: string;
  title: string;
  youtube: string;
}

export default function App() {
  const [tracks, setTracks] = React.useState<Track[]>([]);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [info, setInfo] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/tracks");
      const data = await response.json();

      setTracks(data);
    })();
  }, []);

  const playTrack = async (track: Track) => {
    const response = await fetch(`http://localhost:8000/tracks/${track.id}`);
    const data = await response.json();

    if (videoRef.current) {
      setInfo(`Playing ${track.title}`);
      videoRef.current.src = data.url;
      videoRef.current.currentTime = data.track.start;
      videoRef.current.play();
    }
  };

  return (
    <div className="App">
      <h1>{info}</h1>
      <video ref={videoRef} width="800px" autoPlay controls />
      <div style={{ display: "flex" }}>
        {tracks.map((track) => (
          <div
            key={track.id}
            onClick={() => {
              playTrack(track);
            }}
            style={{
              border: "1px solid black",
              width: "200px",
              margin: "10px",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            <img
              alt="cover"
              src={`https://img.youtube.com/vi/${track.youtube}/maxresdefault.jpg`}
              style={{
                width: "200px",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{track.artist}</span>
              <span>{track.title}</span>
              <span>{track.date}</span>
              <span>
                {new Date((track.end - track.start) * 1000)
                  .toISOString()
                  .substring(14, 19)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
