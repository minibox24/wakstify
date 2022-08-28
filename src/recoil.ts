import { atom } from "recoil";

import { INowPlaying } from "./types";

export const nowPlaying = atom<INowPlaying | null>({
  key: "nowPlaying",
  default: null,
});

export const queue = atom<INowPlaying[]>({
  key: "queue",
  default: [],
});
