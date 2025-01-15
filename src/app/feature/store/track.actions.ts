//load Tracks
import {createAction, props} from "@ngrx/store";
import {MusicCategory, Track} from "../../core/models/track.model";

export const loadTracks = createAction('[Track] Load Tracks');
export const loadTracksSuccess = createAction('[Track] Load Tracks Success', props<{ tracks: Track[] }>());
export const loadTracksFailure = createAction('[Track] Load Tracks Failure', props<{ error: string }>());
export const loadTrack = createAction('[Track] Load Track', props<{ id: string }>());
export const loadTrackSuccess = createAction('[Track] Load Track Success', props<{ track: Track }>());
export const loadTrackFailure = createAction('[Track] Load Track Failure', props<{ error: string }>());

//add track
export const addTrack = createAction(
  '[Track] Add Track',
  props<{
    track: Track;
    audioFile: Blob;
    imageFile?: File;
  }>()
);
export const addTrackSuccess=createAction('[Track] Add Track Success', props<{ track: Track }>());
export const addTrackFailure=createAction('[Track] Add Track Failure', props<{ error: string }>());

//update Track
export const updateTrack = createAction(
  '[Track] Update Track',
  props<{
    updatedTrack: Track,
    audioFile: Blob | null,
    imageFile: File | null
  }>()
);
export const updateTrackSuccess=createAction('[Track] Update Track Success', props<{ track: Track }>());
export const updateTrackFailure=createAction('[Track] Update Track Failure', props<{ error: string }>());

//delete Track
export const deleteTrack=createAction('[Track] Delete Track', props<{ id: string }>());
export const deleteTrackSuccess=createAction('[Track] Delete Track Success', props<{ id: string }>());
export const deleteTrackFailure = createAction('[Track] Delete Track Failure', props<{ error: string }>());



//filtrage with categories
export const setSelectedCategory = createAction(
  '[Track] Set Selected Category',
  props<{ category: MusicCategory | null }>()
);

export const loadTrackImage = createAction(
  '[Track] Load Track Image',
  props<{ trackId: string }>()
);

export const loadTrackImageSuccess = createAction(
  '[Track] Load Track Image Success',
  props<{ trackId: string; imageUrl: string }>()
);

export const loadTrackImageFailure = createAction(
  '[Track] Load Track Image Failure',
  props<{ trackId: string; error: string }>()
);

export const imageLoadError = createAction(
  '[Track] Image Load Error',
  props<{ trackId: string }>()
);

export const toggleFavorite = createAction(
  '[Track] Toggle Favorite',
  props<{ trackId: string }>()
);
export const toggleFavoriteSuccess = createAction(
  '[Track] Toggle Favorite Success',
  props<{ track: Track }>()
);
export const toggleFavoriteFailure = createAction(
  '[Track] Toggle Favorite Failure',
  props<{ error: string }>()
);
