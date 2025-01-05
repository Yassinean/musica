export interface Track {
  id: string;
  name: string;
  artist: string;
  description?: string;
  dateAdded: string;
  duration: number; // in seconds
  category: CategoryMusic;
  coverImage?: Blob; // Optional cover image
}

export enum CategoryMusic {
  POP = 'pop',
  ROCK = 'rock',
  RAP = 'rap',
  CHAABI = 'cha3bi',
  OTHER = 'other',
}

export enum PlayerState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  STOPPED = 'stopped',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success',
}
