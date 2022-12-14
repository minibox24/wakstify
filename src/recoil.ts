import { atom } from "recoil";

import { INowPlaying, ELoopType } from "./types";

export const nowPlaying = atom<INowPlaying | null>({
  key: "nowPlaying",
  default: null,
});

export const queue = atom<INowPlaying[]>({
  key: "queue",
  default: [],
});

export const shuffle = atom<boolean>({
  key: "shuffle",
  default: false,
});

export const loop = atom<ELoopType>({
  key: "loop",
  default: ELoopType.None,
});

export const openPlaylist = atom<boolean>({
  key: "openPlaylist",
  default: false,
});

export const fullscreen = atom<boolean>({
  key: "fullscreen",
  default: false,
});

export const volume = atom<number>({
  key: "volume",
  default: 1,
});

export const currentTime = atom<number>({
  key: "currentTime",
  default: 0,
});

export const paused = atom<boolean>({
  key: "paused",
  default: true,
});
