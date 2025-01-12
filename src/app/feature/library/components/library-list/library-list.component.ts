import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PlayerState, Track } from "../../../../core/models/track.model";
import { BehaviorSubject, Observable, Subject, Subscription, takeUntil } from "rxjs";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { AudioService } from "../../../../core/service/audio.service";
import { TrackService } from "../../../../core/service/track.service";
import { selectFilteredTracks, selectTrackError, selectTrackLoading } from "../../../store/track.selectors";
import * as TrackActions from "../../../store/track.actions";
import { SearchTrackPipe } from "../../../../shared/pipe/search-track.pipe";

@Component({
  selector: 'app-library-list',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    AsyncPipe,
    DatePipe,
    SearchTrackPipe
  ],
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.scss'],
})
export class LibraryListComponent implements OnInit, OnDestroy {
  @Input() tracks: Track[] | null = null;
  @Input() searchTerm: string = '';

  tracks$: Observable<Track[]>;
  trackError$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  openDropdownId: string | null = null;
  playerState: PlayerState = PlayerState.STOPPED;
  private readonly playerStateSubscription: Subscription;
  private readonly destroy$ = new Subject<void>();
  protected readonly imageLoadError = new BehaviorSubject<{ [key: string]: boolean }>({});
  imageUrls: { [trackId: string]: string } = {};
  currentTrack: Track | null = null;

  readonly defaultCoverImage = 'https://res.cloudinary.com/dz4pww2qv/image/upload/v1735915190/apbake6pbviilhdi1brd.jpg';

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly audioPlayer: AudioService,
    private readonly trackService: TrackService,
  ) {
    this.tracks$ = this.store.select(selectFilteredTracks);
    this.trackError$ = this.store.select(selectTrackError);
    this.isLoading$ = this.store.select(selectTrackLoading);
    this.playerStateSubscription = this.audioPlayer.playerState$.pipe(takeUntil(this.destroy$))
      .subscribe(state => this.playerState = state);
    this.audioPlayer.currentTrack$.pipe(takeUntil(this.destroy$))
      .subscribe(track => this.currentTrack = track);
  }

  ngOnInit(): void {
    this.preloadDefaultImage();
    this.loadTracks();
    this.tracks$.subscribe((tracks) => {
      tracks.forEach((track) => {
        if (track.imageFileId) {
          this.trackService.getImageFileUrl(track.imageFileId).subscribe({
            next: (url) => {
              if (typeof url === "string") {
                this.imageUrls[track.id!] = url;
              } else {
                this.imageUrls[track.id!] = this.defaultCoverImage;
              }
              console.log('Image URL fetched for track:', track.title, url);
            },
            error: (err) => {
              console.error('Error fetching image file URL:', err);
              this.imageUrls[track.id!] = this.defaultCoverImage;
            },
          });
        } else {
          this.imageUrls[track.id!] = this.defaultCoverImage;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.playerStateSubscription) {
      this.playerStateSubscription.unsubscribe();
    }
  }

  private preloadDefaultImage(): void {
    const img = new Image();
    img.src = this.defaultCoverImage;
  }

  private loadTracks(): void {
    this.tracks$.pipe(takeUntil(this.destroy$)).subscribe((tracks) => {
      if (!tracks || tracks.length === 0) {
        this.store.dispatch(TrackActions.loadTracks());
      }
    });
  }

  handleImageError(trackId: string, event: Event): void {
    console.error(`Image load error for track ${trackId}:`, {
      type: event.type,
      target: event.target,
      currentTarget: event.currentTarget,
      timeStamp: event.timeStamp,
    });

    this.store.dispatch(TrackActions.imageLoadError({ trackId }));
    this.imageLoadError.next({ ...this.imageLoadError.value, [trackId]: true });
  }

  getTrackImage(track: Track): string {
    const imageUrl = this.imageUrls[track.id];
    if (!imageUrl) {
      console.log(`No imageUrl for track ${track.id}, using default`);
      return this.defaultCoverImage;
    }

    if (this.isBlobUrl(imageUrl)) {

      return imageUrl;
    }
    const hasError = this.imageLoadError.value[track.id];
    if (hasError) {
      console.log(`Using default image for track ${track.id} due to previous error`);
      return this.defaultCoverImage;
    }
    return imageUrl;
  }

  private isBlobUrl(url: string | undefined): boolean {
    return <boolean>url?.startsWith('blob:');
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  toggleDropdown(trackId: string): void {
    this.openDropdownId = this.openDropdownId === trackId ? null : trackId;
  }

  closeDropdown(trackId: string): void {
    if (this.openDropdownId === trackId) {
      this.openDropdownId = null;
    }
  }

  onUpdateTrack(track: Track): void {
    console.log(`Navigating to edit track with ID: ${track.id}`);
    this.router.navigate(['/track/edit', track.id]).catch(err => {
      console.error('Navigation error:', err);
    });
    this.closeDropdown(track.id);
  }

  onDeleteTrack(trackId: string): void {
    if (confirm('Are you sure you want to delete this track?')) {
      this.store.dispatch(TrackActions.deleteTrack({ id: trackId }));
    }
    this.closeDropdown(trackId);
  }

  togglePlay(track: Track, event: Event): void {
    event.stopPropagation(); // Prevent navigation
    if (this.isCurrentTrack(track) && this.playerState === PlayerState.PLAYING) {
      this.audioPlayer.pause();
    } else {
      this.audioPlayer.play(track).catch(error => {
        console.error('Error playing track:', error);
      });
    }
  }

  navigateToTrackDetails(track: Track): void {
    this.router.navigate(['/track', track.id]).then(() => {
      console.log('Navigated to track details');
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  isTrackPlaying(track: Track): boolean {
    return this.currentTrack?.id === track.id && this.playerState === PlayerState.PLAYING;
  }

  isCurrentTrack(track: Track): boolean {
    return this.currentTrack?.id === track.id;
  }
}
