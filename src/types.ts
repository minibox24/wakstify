export interface ITrack {
  id: string;
  date: string;
  start: number;
  end: number;

  cover: string;
  artist: string;
  title: string;
  youtube: string;
}

export interface INowPlaying {
  track: ITrack;
  url: string;
}

export enum ELoopType {
  None = "none",
  All = "all",
  One = "one",
}
