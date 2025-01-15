import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {filter, Observable, take} from 'rxjs';
import { Track } from '../../core/models/track.model';
import { LibraryListComponent } from '../library/components/library-list/library-list.component';
import { selectFavoriteTracks, selectTrackError, selectTrackLoading } from '../store/track.selectors';
import * as TrackActions from '../store/track.actions';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, LibraryListComponent],
  templateUrl: './favorites-page.component.html',
})
export class FavoritesPageComponent implements OnInit {
  favoriteTracks$: Observable<Track[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.favoriteTracks$ = this.store.select(selectFavoriteTracks);
    this.loading$ = this.store.select(selectTrackLoading);
    this.error$ = this.store.select(selectTrackError);
  }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.store.dispatch(TrackActions.loadTracks());
  }
}
