import { atom } from "recoil";

import { INowPlaying } from "../types";

export default atom<INowPlaying | null>({
  key: "nowPlaying",
  default: null,
});
