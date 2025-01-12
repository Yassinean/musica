export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedAt: Date;
  duration: number;
  category: MusicCategory;
  fileUrl: string;
  imageUrl?: string;
  imageFileId: string;
}

export enum MusicCategory{
  CHAABI = '🎵 cha3bi',
  POP = '🎤 pop',
  ROCK = '💿 rock',
  RAP = '🎸 rap',
  OTHER = '🎼 other'
}

export enum PlayerState {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  BUFFERING = 'BUFFERING',
  STOPPED = 'STOPPED',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}
