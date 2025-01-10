import {MusicCategory, Track} from "../../core/models/track.model";
import {createReducer, on} from "@ngrx/store";
import * as TrackActions from './track.actions';

export interface TrackState {
  imageLoadErrors: any;
  tracks: Track[];
  selectedTrack: Track | null;
  loading: boolean;
  error: string | null;
  selectedCategory: MusicCategory | null;
}

const initialState: TrackState = {
  tracks: [],
  imageLoadErrors: null,
  selectedTrack: null,
  loading: false,
  error: null,
  selectedCategory: null
}

export const trackReducer = createReducer(
  initialState,
  on(TrackActions.loadTracks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({
    ...state,
    tracks,
    loading: false,
    error: null
  })),

  on(TrackActions.loadTracksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(TrackActions.addTrackSuccess, (state, {track}) => ({
    ...state,
    loading: !state.loading,
    tracks: [...state.tracks, track],
  })),
  on(TrackActions.addTrackFailure, (state, {error}) => ({...state, error})),


  on(TrackActions.updateTrackSuccess, (state, {track}) => ({
    ...state,
    loading: !state.loading,
    tracks: state.tracks.map((t) => (t.id === track.id) ? track : t),
  })),
  on(TrackActions.updateTrackFailure, (state, {error}) => ({...state, error})),



  on(TrackActions.deleteTrackSuccess, (state, {id}) => ({
    ...state,
    tracks: state.tracks.filter((t) => t.id !== id),
  })),

  on(TrackActions.deleteTrackFailure, (state, {error}) => ({...state, error})),

  on(TrackActions.setSelectedCategory, (state, { category }) => ({
    ...state,
    selectedCategory: category
  })),
  on(TrackActions.imageLoadError, (state, { trackId }) => ({
    ...state,
    imageLoadErrors: {
      ...state.imageLoadErrors,
      [trackId]: true
    }
  }))
)
