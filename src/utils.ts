import { ITrack } from "./types";

export const convertDate = (date: string) => {
  const splited = date.split(".");
  return `20${splited[0]}년 ${splited[1]}월 ${splited[2]}일`;
};

export const trackDurationToReadable = (track: ITrack) => {
  return new Date((track.end - track.start) * 1000)
    .toISOString()
    .substring(14, 19);
};

export const timeToReadable = (time: number) => {
  return new Date(time * 1000).toISOString().substring(14, 19);
};
