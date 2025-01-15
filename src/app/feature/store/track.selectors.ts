import {createFeatureSelector, createSelector} from "@ngrx/store";
import {TrackState} from "./track.reducers";

export const selectTrackState=  createFeatureSelector<TrackState>('tracks');
export const selectTrackLoading = createSelector(
  selectTrackState,
  (state: TrackState) => state.loading
);
export const selectAllTracks = createSelector(selectTrackState , (state) => state.tracks);
export const selectTrackError=createSelector(selectTrackState , (state) => state.error)
export const selectTrackById = (id: string) =>
  createSelector(selectTrackState, (state) =>
    state.tracks.find((track) => track.id === id)
  );


export const selectSelectedCategory = createSelector(
  selectTrackState,
  (state: TrackState) => state.selectedCategory
);

export const selectFilteredTracks = createSelector(
  selectAllTracks,
  selectSelectedCategory,
  (tracks, selectedCategory) => {
    if (!selectedCategory) return tracks;
    return tracks.filter(track => track.category === selectedCategory);
  }
);

export const selectImageLoadErrors = createSelector(
  selectTrackState,
  (state: TrackState) => state.imageLoadErrors
);

export const selectFavoriteTracks = createSelector(
  selectAllTracks,
  (tracks) => tracks.filter(track => track.isFavorite)
);
