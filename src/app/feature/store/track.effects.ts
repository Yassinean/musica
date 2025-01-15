import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as TrackActions from './track.actions';
import {mergeMap, map, catchError, of} from "rxjs";
import {TrackService} from "../../core/service/track.service";

@Injectable()
export class TrackEffects {
  constructor(private readonly action$: Actions, private readonly trackService: TrackService) {
  }

  loadTracks$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.loadTracks),
      mergeMap(() =>
        this.trackService.getAllTrackMetadata().pipe(
          map((tracks) => TrackActions.loadTracksSuccess({ tracks })),
          catchError(error => of(TrackActions.loadTracksFailure({ error })))
        )
      )
    )
  );

  loadTrack$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.loadTrack),
      mergeMap(({ id }) =>
        this.trackService.getTrackById(id).pipe(
          map((track) => {
            if (!track) {
              return TrackActions.loadTrackFailure({ error: 'Track not found' });
            }
            return TrackActions.loadTrackSuccess({ track });
          }),
          catchError((error) => of(TrackActions.loadTrackFailure({ error })))
        )
      )
    )
  );

  addTrack$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.addTrack),
      mergeMap(({ track, audioFile , imageFile}) =>
        this.trackService.addTrack(track, audioFile , imageFile).pipe(
          map((newTrack) => TrackActions.addTrackSuccess({ track: newTrack })),
          catchError(error => of(TrackActions.addTrackFailure({ error })))
        )
      )
    )
  );

  updateTrack$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.updateTrack),
      mergeMap(({ updatedTrack, audioFile, imageFile }) => {
        // Convert File to Blob if needed
        const audioBlob = audioFile instanceof File ? audioFile : audioFile;
        const imageBlob = imageFile instanceof File ? imageFile : imageFile;

        return this.trackService.updateTrack(updatedTrack, audioBlob, imageBlob).pipe(
          map((track) => TrackActions.updateTrackSuccess({ track })),
          catchError((error) => of(TrackActions.updateTrackFailure({ error })))
        );
      })
    )
  );

  // Delete track effect
  deleteTrack$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.deleteTrack),
      mergeMap(({ id }) =>
        this.trackService.deleteTrack(id).pipe(
          map(() => TrackActions.deleteTrackSuccess({ id })),
          catchError((error) => of(TrackActions.deleteTrackFailure({ error })))
        )
      )
    )
  );

  toggleFavorite$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.toggleFavorite),
      mergeMap(({ trackId }) =>
        this.trackService.toggleFavorite(trackId).pipe(
          map((track) => TrackActions.toggleFavoriteSuccess({ track })),
          catchError((error) => of(TrackActions.toggleFavoriteFailure({ error: error.message || 'Error toggling favorite' })))
        )
      )
    )
  );

}
